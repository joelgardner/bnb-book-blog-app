/*
  create a utils schema so these functions aren't a part of the public schema
*/
create schema if not exists utils;

/*
  create function set_created_at
*/
drop function if exists utils.set_created_at() cascade;
create function utils.set_created_at() returns trigger as $$
begin
  if (new.created_at is null) then    -- allow setting of `created_at` manually
    new.created_at := current_timestamp;
  end if;
  return new;
end;
$$ language plpgsql;

/*
  create function set_updated_at
*/
drop function if exists utils.set_updated_at() cascade;
create function utils.set_updated_at() returns trigger as $$
begin
  new.updated_at := current_timestamp;
  return new;
end;
$$ language plpgsql;

/*
  create function set_created_by
*/
drop function if exists utils.set_created_by() cascade;
create function utils.set_created_by() returns trigger as $$
begin
  new.created_by := current_setting('context.user')::int;
  return new;
end;
$$ language plpgsql;

/*
  create function that runs when a CREATE TABLE command is executed.
  it will add the columns and triggers that automatically set values:
  - created_at
  - updated_at
  - created_by
*/
drop function if exists utils.add_columns_on_create_table() cascade;
create function utils.add_columns_on_create_table() returns event_trigger as $$
declare
  r record;
  s record;
begin

  -- for each create table command, we add created_at, updated_at, and organization
  for r in select object_identity, objid from pg_event_trigger_ddl_commands() where object_type = 'table' group by object_identity, objid
  loop

    -- created_at column
    if not exists (select 1 from pg_attribute where attrelid = r.objid and attname = 'created_at') then
      execute('
        alter table ' || r.object_identity || ' add created_at timestamp not null;
      ');
    end if;

    -- created_at trigger
    if not exists (select 1 from pg_trigger t where t.tgrelid = r.objid and tgname = 'created_at') then
      execute('
        create trigger created_at before insert on ' || r.object_identity || ' for each row execute procedure utils.set_created_at();
      ');
    end if;

    -- updated_at column
    if not exists (select 1 from pg_attribute where attrelid = r.objid and attname='updated_at') then
      execute('
        alter table ' || r.object_identity || ' add updated_at timestamp;
      ');
    end if;

    -- updated_at trigger
    if not exists (select 1 from pg_trigger t where t.tgrelid = r.objid and tgname = 'updated_at') then
      execute('
        create trigger updated_at before update on ' || r.object_identity || ' for each row execute procedure utils.set_updated_at();
      ');
    end if;

    -- created_by column
    if not exists (select 1 from pg_attribute where attrelid = r.objid and attname='created_by') then
      execute('
        alter table ' || r.object_identity || ' add created_by int,
        add constraint fk_' || r.object_identity || '_created_by_users_id
        foreign key references users(id)
        on delete cascade;
      ');
    end if;

    -- created_by trigger
    if not exists (select 1 from pg_trigger t where t.tgrelid = r.objid and tgname = 'created_by') then
      execute('
        create trigger created_by before insert on ' || r.object_identity || ' for each row execute procedure utils.set_created_by();
      ');
    end if;

  end loop;

end;
$$ language 'plpgsql';
