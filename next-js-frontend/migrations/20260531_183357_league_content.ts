import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "league_media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"prefix" varchar DEFAULT 'league',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "league_seasons" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"year" numeric NOT NULL,
  	"heading" varchar NOT NULL,
  	"caption" varchar,
  	"published" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "league_teams" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"season_id" integer NOT NULL,
  	"image_id" integer,
  	"overall_placement" varchar,
  	"display_order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "league_events_participants" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL
  );
  
  CREATE TABLE "league_events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"league_id" integer NOT NULL,
  	"event_name" varchar NOT NULL,
  	"event_date" timestamp(3) with time zone NOT NULL,
  	"event_type" varchar,
  	"place" varchar,
  	"display_order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "league_media_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "league_seasons_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "league_teams_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "league_events_id" integer;
  ALTER TABLE "league_teams" ADD CONSTRAINT "league_teams_season_id_league_seasons_id_fk" FOREIGN KEY ("season_id") REFERENCES "public"."league_seasons"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "league_teams" ADD CONSTRAINT "league_teams_image_id_league_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."league_media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "league_events_participants" ADD CONSTRAINT "league_events_participants_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."league_events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "league_events" ADD CONSTRAINT "league_events_league_id_league_teams_id_fk" FOREIGN KEY ("league_id") REFERENCES "public"."league_teams"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "league_media_updated_at_idx" ON "league_media" USING btree ("updated_at");
  CREATE INDEX "league_media_created_at_idx" ON "league_media" USING btree ("created_at");
  CREATE UNIQUE INDEX "league_media_filename_idx" ON "league_media" USING btree ("filename");
  CREATE INDEX "league_seasons_updated_at_idx" ON "league_seasons" USING btree ("updated_at");
  CREATE INDEX "league_seasons_created_at_idx" ON "league_seasons" USING btree ("created_at");
  CREATE INDEX "league_teams_season_idx" ON "league_teams" USING btree ("season_id");
  CREATE INDEX "league_teams_image_idx" ON "league_teams" USING btree ("image_id");
  CREATE INDEX "league_teams_updated_at_idx" ON "league_teams" USING btree ("updated_at");
  CREATE INDEX "league_teams_created_at_idx" ON "league_teams" USING btree ("created_at");
  CREATE INDEX "league_events_participants_order_idx" ON "league_events_participants" USING btree ("_order");
  CREATE INDEX "league_events_participants_parent_id_idx" ON "league_events_participants" USING btree ("_parent_id");
  CREATE INDEX "league_events_league_idx" ON "league_events" USING btree ("league_id");
  CREATE INDEX "league_events_updated_at_idx" ON "league_events" USING btree ("updated_at");
  CREATE INDEX "league_events_created_at_idx" ON "league_events" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_league_media_fk" FOREIGN KEY ("league_media_id") REFERENCES "public"."league_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_league_seasons_fk" FOREIGN KEY ("league_seasons_id") REFERENCES "public"."league_seasons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_league_teams_fk" FOREIGN KEY ("league_teams_id") REFERENCES "public"."league_teams"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_league_events_fk" FOREIGN KEY ("league_events_id") REFERENCES "public"."league_events"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_league_media_id_idx" ON "payload_locked_documents_rels" USING btree ("league_media_id");
  CREATE INDEX "payload_locked_documents_rels_league_seasons_id_idx" ON "payload_locked_documents_rels" USING btree ("league_seasons_id");
  CREATE INDEX "payload_locked_documents_rels_league_teams_id_idx" ON "payload_locked_documents_rels" USING btree ("league_teams_id");
  CREATE INDEX "payload_locked_documents_rels_league_events_id_idx" ON "payload_locked_documents_rels" USING btree ("league_events_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "league_media" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "league_seasons" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "league_teams" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "league_events_participants" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "league_events" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "league_media" CASCADE;
  DROP TABLE "league_seasons" CASCADE;
  DROP TABLE "league_teams" CASCADE;
  DROP TABLE "league_events_participants" CASCADE;
  DROP TABLE "league_events" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_league_media_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_league_seasons_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_league_teams_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_league_events_fk";
  
  DROP INDEX "payload_locked_documents_rels_league_media_id_idx";
  DROP INDEX "payload_locked_documents_rels_league_seasons_id_idx";
  DROP INDEX "payload_locked_documents_rels_league_teams_id_idx";
  DROP INDEX "payload_locked_documents_rels_league_events_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "league_media_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "league_seasons_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "league_teams_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "league_events_id";`)
}
