-- ============================================
-- 用户名唯一性检查函数
-- ============================================
-- 功能：检查指定的用户名是否已被其他用户使用
-- 返回：true = 用户名已存在，false = 用户名可用
-- ============================================

CREATE OR REPLACE FUNCTION check_username_exists(username_to_check TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_count INTEGER;
BEGIN
  -- 查询有多少用户使用了这个用户名（不区分大小写）
  SELECT COUNT(*)
  INTO user_count
  FROM auth.users
  WHERE LOWER(raw_user_meta_data->>'username') = LOWER(username_to_check)
    OR LOWER(raw_user_meta_data->>'username_lower') = LOWER(username_to_check);
  
  -- 如果找到任何用户，返回 true（用户名已存在）
  RETURN user_count > 0;
END;
$$;

-- 添加函数说明
COMMENT ON FUNCTION check_username_exists(TEXT) IS '检查用户名是否已被占用（不区分大小写）';

-- ============================================
-- 测试函数
-- ============================================
-- 测试 1: 检查一个不存在的用户名（应该返回 false）
-- SELECT check_username_exists('test_user_12345');

-- 测试 2: 检查一个已存在的用户名（应该返回 true）
-- SELECT check_username_exists('your_existing_username');
