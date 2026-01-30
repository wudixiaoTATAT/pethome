-- ============================================
-- 批量确认所有用户的邮箱
-- ============================================
-- 用途：修复 "Email not confirmed" 错误
-- 说明：这个脚本会确认所有未验证邮箱的用户
-- ============================================

-- 方案 1：确认所有未验证的用户（推荐）
UPDATE auth.users 
SET 
  email_confirmed_at = NOW(),
  confirmed_at = NOW()
WHERE email_confirmed_at IS NULL;

-- 查看确认了多少用户
SELECT COUNT(*) as confirmed_users_count
FROM auth.users
WHERE email_confirmed_at IS NOT NULL;

-- ============================================
-- 可选：确认特定用户
-- ============================================

-- 方案 2：只确认特定邮箱
-- UPDATE auth.users 
-- SET 
--   email_confirmed_at = NOW(),
--   confirmed_at = NOW()
-- WHERE email = 'your-email@example.com';

-- ============================================
-- 查看所有用户的邮箱确认状态
-- ============================================

SELECT 
  email,
  created_at,
  email_confirmed_at,
  CASE 
    WHEN email_confirmed_at IS NOT NULL THEN '✅ 已确认'
    ELSE '❌ 未确认'
  END as status
FROM auth.users
ORDER BY created_at DESC;

-- ============================================
-- 使用说明
-- ============================================
-- 1. 复制上面的 UPDATE 语句
-- 2. 在 Supabase Dashboard → SQL Editor 中执行
-- 3. 执行后所有用户都可以正常登录
-- ============================================
