/*
  # Complete Notepad Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `created_at` (timestamp)
    - `folders`
      - `id` (uuid, primary key)
      - `name` (text)
      - `color` (text, default gray)
      - `parent_id` (uuid, references folders)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamp)
    - `notes`
      - `id` (uuid, primary key)
      - `title` (text, default 'Untitled Note')
      - `content` (text)
      - `is_encrypted` (boolean, default false)
      - `is_code_mode` (boolean, default false)
      - `language` (text, default 'plaintext')
      - `folder_id` (uuid, references folders)
      - `tags` (text array)
      - `is_deleted` (boolean, default false)
      - `is_favorite` (boolean, default false)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data

  3. Functions
    - Auto-update timestamp trigger for notes
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create folders table
CREATE TABLE IF NOT EXISTS folders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  color text DEFAULT '#6b7280',
  parent_id uuid REFERENCES folders(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Create notes table
CREATE TABLE IF NOT EXISTS notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text DEFAULT 'Untitled Note' NOT NULL,
  content text DEFAULT '',
  is_encrypted boolean DEFAULT false,
  is_code_mode boolean DEFAULT false,
  language text DEFAULT 'plaintext',
  folder_id uuid REFERENCES folders(id) ON DELETE SET NULL,
  tags text[] DEFAULT '{}',
  is_deleted boolean DEFAULT false,
  is_favorite boolean DEFAULT false,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_folders_user_id ON folders(user_id);
CREATE INDEX IF NOT EXISTS idx_folders_parent_id ON folders(parent_id);
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_folder_id ON notes(folder_id);
CREATE INDEX IF NOT EXISTS idx_notes_updated_at ON notes(updated_at DESC);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create RLS policies for folders table
CREATE POLICY "Users can view their own folders" ON folders
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own folders" ON folders
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own folders" ON folders
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own folders" ON folders
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Create RLS policies for notes table
CREATE POLICY "Users can view their own notes" ON notes
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own notes" ON notes
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes" ON notes
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes" ON notes
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for notes updated_at
DROP TRIGGER IF EXISTS update_notes_updated_at ON notes;
CREATE TRIGGER update_notes_updated_at
  BEFORE UPDATE ON notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();