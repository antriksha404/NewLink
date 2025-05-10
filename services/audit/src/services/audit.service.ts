import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
 import { DataSource } from 'typeorm';
 
 @Injectable()
 export class AuditService implements OnModuleInit {
   constructor(
    @Inject('ENALBE_DB_AUDIT') private enableAudit: any,
		@Inject('DISALBE_DB_AUDIT') private disableAudit: any,
    private readonly dataSource: DataSource
  ) {
     this.initializeAudit();
   }
 
   private async initializeAudit() {
     await this.createLogTable();
     await this.createTriggerFunction();
 
     if (this.enableAudit) {
       await this.attachTriggers();
     }
 
     if (this.disableAudit) {
       await this.removeTriggers();
     }
   }
 
   async createLogTable() {
     const queryRunner = this.dataSource.createQueryRunner();
     await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS audit_actions (
      id BIGSERIAL PRIMARY KEY,  -- Uses BIGSERIAL to avoid conflicts with ID generation
      schema_name TEXT NOT NULL,
      table_name TEXT NOT NULL,
      record_id INT NOT NULL,
      user_name TEXT NOT NULL,
      action CHAR(1) NOT NULL CHECK (action IN ('I', 'U', 'D')),
      original_data TEXT,
      new_data TEXT,
      query TEXT,
      changed_at TIMESTAMPTZ DEFAULT now()
      );

      DO $$
      BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'audit_actions_id_seq') THEN
              CREATE SEQUENCE audit_actions_id_seq OWNED BY audit_actions.id;
              ALTER TABLE audit_actions ALTER COLUMN id SET DEFAULT nextval('audit_actions_id_seq');
          END IF;
      END $$;
     `);
     await queryRunner.release();
   }
 
   async createTriggerFunction() {
     const queryRunner = this.dataSource.createQueryRunner();
     await queryRunner.query(`
      DROP FUNCTION IF EXISTS log_current_action() CASCADE;

      CREATE OR REPLACE FUNCTION log_current_action() RETURNS trigger AS $body$
      DECLARE
          v_old_data TEXT;
          v_new_data TEXT;
      BEGIN
          IF (TG_OP = 'UPDATE') THEN
              v_old_data := ROW(OLD.*);
              v_new_data := ROW(NEW.*);
              INSERT INTO audit_actions 
              (schema_name, table_name, record_id, user_name, action, original_data, new_data, query)
              VALUES 
              (TG_TABLE_SCHEMA::TEXT, TG_TABLE_NAME::TEXT, NEW.id, session_user::TEXT, substring(TG_OP,1,1), v_old_data, v_new_data, current_query());
              RETURN NEW;
          ELSIF (TG_OP = 'DELETE') THEN
              v_old_data := ROW(OLD.*);
              INSERT INTO audit_actions 
              (schema_name, table_name, record_id, user_name, action, original_data, query)
              VALUES 
              (TG_TABLE_SCHEMA::TEXT, TG_TABLE_NAME::TEXT, OLD.id, session_user::TEXT, substring(TG_OP,1,1), v_old_data, current_query());
              RETURN OLD;
          ELSIF (TG_OP = 'INSERT') THEN
              v_new_data := ROW(NEW.*);
              INSERT INTO audit_actions 
              (schema_name, table_name, record_id, user_name, action, new_data, query)
              VALUES 
              (TG_TABLE_SCHEMA::TEXT, TG_TABLE_NAME::TEXT, NEW.id, session_user::TEXT, substring(TG_OP,1,1), v_new_data, current_query());
              RETURN NEW;
          ELSE
              RAISE WARNING '[LOG_CURRENT_ACTION] - Other action occurred: %, at %', TG_OP, now();
              RETURN NULL;
          END IF;
      EXCEPTION
          WHEN data_exception THEN
              RAISE WARNING '[LOG_CURRENT_ACTION] - Data Exception';
              RETURN NULL;
          WHEN unique_violation THEN
              RAISE WARNING '[LOG_CURRENT_ACTION] - Unique Violation';
              RETURN NULL;
          WHEN others THEN
              RAISE WARNING '[LOG_CURRENT_ACTION] - Other Exception';
              RETURN NULL;
      END;
      $body$
      LANGUAGE plpgsql
      SECURITY DEFINER
      SET search_path = pg_catalog, audit_actions;
     `);
     await queryRunner.release();
   }
 
   async attachTriggers() {
     const queryRunner = this.dataSource.createQueryRunner();
     await queryRunner.query(`
      DO $$ 
      DECLARE 
          tbl RECORD;
          trigger_name TEXT;
      BEGIN
          FOR tbl IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename <> 'audit_actions') 
          LOOP
              -- Define trigger name dynamically
              trigger_name := format('trigger_%I', tbl.tablename);
              
              -- Check if the trigger already exists
              IF NOT EXISTS (
                  SELECT 1 
                  FROM pg_trigger 
                  WHERE tgname = trigger_name
              ) THEN
                  EXECUTE format(
                      'CREATE TRIGGER %I
                      AFTER INSERT OR UPDATE OR DELETE ON %I
                      FOR EACH ROW
                      EXECUTE FUNCTION log_current_action();',
                      trigger_name, tbl.tablename
                  );
              END IF;
          END LOOP;
      END $$;
     `);
     await queryRunner.release();
   }
 
   async removeTriggers() {
     const queryRunner = this.dataSource.createQueryRunner();
     await queryRunner.query(`
      DO $$ 
      DECLARE 
          tbl RECORD;
      BEGIN
          FOR tbl IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename <> 'audit_actions') 
          LOOP
              EXECUTE format(
                  'DROP TRIGGER IF EXISTS trigger_%I ON %I;',
                  tbl.tablename, tbl.tablename
              );
          END LOOP;
      END $$;
     `);
     await queryRunner.release();
   }

   onModuleInit() {
    this.initializeAudit();
   }
 }
