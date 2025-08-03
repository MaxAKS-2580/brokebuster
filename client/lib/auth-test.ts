import { supabase } from './supabase';

// Your exact code examples - simplified OAuth functions
export const loginWithGitHub = async () => {
  await supabase.auth.signInWithOAuth({
    provider: 'github'
  });
};

export const loginWithGoogle = async () => {
  await supabase.auth.signInWithOAuth({
    provider: 'google'
  });
};

// Test current user authentication
export const testUserAuth = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  console.log('Current user email:', user?.email);
  console.log('User ID:', user?.id);
  console.log('Full user object:', user);
  return user;
};

// Test session information
export const testSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  console.log('Current session:', session);
  return session;
};

// Enhanced user info display
export const displayUserInfo = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user) {
    console.log('🎉 User authenticated successfully!');
    console.log('📧 Email:', user.email);
    console.log('🆔 User ID:', user.id);
    console.log('📅 Created:', new Date(user.created_at).toLocaleDateString());
    console.log('🔄 Last sign in:', user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'First time');
    
    // Check provider used
    if (user.app_metadata?.provider) {
      console.log('🔑 Provider:', user.app_metadata.provider);
    }
    
    // GitHub specific info
    if (user.user_metadata?.user_name) {
      console.log('🐱 GitHub username:', user.user_metadata.user_name);
    }
    
    // Google specific info  
    if (user.user_metadata?.full_name) {
      console.log('👤 Full name:', user.user_metadata.full_name);
    }
  } else {
    console.log('❌ No user authenticated');
  }
  
  return user;
};

// Test OAuth providers availability
export const testOAuthProviders = () => {
  console.log('🔧 Available OAuth methods:');
  console.log('• GitHub OAuth:', typeof loginWithGitHub === 'function' ? '✅' : '❌');
  console.log('• Google OAuth:', typeof loginWithGoogle === 'function' ? '✅' : '❌');
  console.log('• User test:', typeof testUserAuth === 'function' ? '✅' : '❌');
};
