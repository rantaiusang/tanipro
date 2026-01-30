import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    "https://dikapquhusbwjccbqcsb.supabase.co", 
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpa2FwcXVodXNid2pjY2JxY3NiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxNjQ1NTQsImV4cCI6MjA4NDc0MDU1NH0.X278oHDF0be7oa25484eliSukSYAYvDbJyU6ysz83zA"
  )
}
