
export const environment = {
  production: false,
  appVersion: require('../../package.json').version + '-dev',
  supabase: {
    url: 'https://cllxejbtmluthwrqsoci.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsbHhlamJ0bWx1dGh3cnFzb2NpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTAyMDEwMjQsImV4cCI6MTk2NTc3NzAyNH0.thAHmei1SsoLU4HEmcE0qtfwCKcWmwFwCdVKQCBEvJs'
  }
};
