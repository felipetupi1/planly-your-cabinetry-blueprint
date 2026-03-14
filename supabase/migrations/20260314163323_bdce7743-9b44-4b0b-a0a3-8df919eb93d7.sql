-- Create team_members table if it doesn't exist
create table if not exists team_members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  email text not null unique,
  role text not null default 'team',
  created_at timestamptz default now()
);

-- Enable RLS
alter table team_members enable row level security;

-- Create policy for team members to read their own record
create policy "Team members can read own record"
  on team_members for select
  using (auth.uid() = user_id);