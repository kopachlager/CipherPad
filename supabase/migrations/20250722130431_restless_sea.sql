/*
  # Add User Settings Table

  1. New Tables
    - `user_settings`
      - `user_id` (uuid, primary key, foreign key to auth.users)
      - `theme` (text, default 'light')
      - `accent_color` (text, default '#6b7280')
      - `font_family` (text, default 'Inter')
      - `font_size` (integer, default 16)
      - `line_height` (numeric, default 1.6)
      - `auto_save` (boolean, default true)
      - `auto_lock` (boolean, default false)
      - `auto_lock_timeout` (integer, default 300000)
      - `biometric_auth` (boolean, default false)
      - `show_word_count` (boolean, default true)
      - `distraction_free_mode` (boolean, default false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `user_settings` table
    - Add policies for authenticated users to manage their own settings

  3. Functions
    - Add trigger to update `updated_at` timestamp
*/

CREATE TABLE IF NOT EXISTS user_settings (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  theme text DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'system')),
  accent_color text DEFAULT '#6b7280',
  font_family text DEFAULT 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  font_size integer DEFAULT 16 CHECK (font_size >= 12 AND font_size <= 24),
  line_height numeric DEFAULT 1.6 CHECK (line_height >= 1.0 AND line_height <= 2.0),
  auto_save boolean DEFAULT true,
  auto_lock boolean DEFAULT false,
  auto_lock_timeout integer DEFAULT 300000,
  biometric_auth boolean DEFAULT false,
  show_word_count boolean DEFAULT true,
  distraction_free_mode boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Users can read their own settings
CREATE POLICY "Users can view own settings"
  ON user_settings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own settings
CREATE POLICY "Users can create own settings"
  ON user_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own settings
CREATE POLICY "Users can update own settings"
  ON user_settings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own settings
CREATE POLICY "Users can delete own settings"
  ON user_settings
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();