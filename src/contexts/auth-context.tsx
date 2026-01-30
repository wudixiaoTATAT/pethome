import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, username: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (username: string, avatarUrl?: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 检查当前会话
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // 监听认证状态变化
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, username: string) => {
    // 1. 验证用户名格式
    if (username.length < 2 || username.length > 20) {
      return { error: new Error('用户名长度必须在 2-20 个字符之间') };
    }

    // 验证用户名只包含字母、数字、中文、下划线
    const usernameRegex = /^[\u4e00-\u9fa5a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      return { error: new Error('用户名只能包含中文、字母、数字和下划线') };
    }

    // 2. 检查用户名是否已被占用
    try {
      // 查询所有用户的 user_metadata 中的 username
      const { data: existingUsers, error: queryError } = await supabase.rpc(
        'check_username_exists',
        { username_to_check: username.toLowerCase() }
      );

      // 如果 RPC 函数不存在，使用备用方案
      if (queryError && queryError.code === '42883') {
        // RPC 函数未创建，跳过检查（向下兼容）
        console.warn('用户名唯一性检查功能未启用，请在 Supabase 中创建 check_username_exists 函数');
      } else if (queryError) {
        throw queryError;
      } else if (existingUsers === true) {
        return { error: new Error('该用户名已被占用，请换一个') };
      }
    } catch (error: any) {
      console.error('检查用户名失败:', error);
      // 继续注册流程，不阻止用户注册
    }

    // 3. 注册用户
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          username_lower: username.toLowerCase(), // 存储小写版本用于查询
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        },
        emailRedirectTo: window.location.origin,
      },
    });
    
    if (error) {
      return { error };
    }
    
    // 提示用户检查邮箱（如果需要邮箱确认）
    console.log('注册成功！如果需要邮箱验证，请检查您的邮箱。');
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const updateProfile = async (username: string, avatarUrl?: string) => {
    if (!user) return { error: new Error('No user') };

    const updates: any = { username };
    if (avatarUrl) updates.avatar_url = avatarUrl;

    const { error } = await supabase.auth.updateUser({
      data: updates,
    });

    return { error };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}