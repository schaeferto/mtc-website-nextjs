import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "news_media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"prefix" varchar DEFAULT 'news',
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
  
  CREATE TABLE "news_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"is_cover" boolean DEFAULT false
  );
  
  CREATE TABLE "news" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"header" varchar NOT NULL,
  	"content" jsonb,
  	"date" timestamp(3) with time zone,
  	"release_date" timestamp(3) with time zone,
  	"published" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "news_media_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "news_id" integer;
  ALTER TABLE "news_images" ADD CONSTRAINT "news_images_image_id_news_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."news_media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news_images" ADD CONSTRAINT "news_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "news_media_updated_at_idx" ON "news_media" USING btree ("updated_at");
  CREATE INDEX "news_media_created_at_idx" ON "news_media" USING btree ("created_at");
  CREATE UNIQUE INDEX "news_media_filename_idx" ON "news_media" USING btree ("filename");
  CREATE INDEX "news_images_order_idx" ON "news_images" USING btree ("_order");
  CREATE INDEX "news_images_parent_id_idx" ON "news_images" USING btree ("_parent_id");
  CREATE INDEX "news_images_image_idx" ON "news_images" USING btree ("image_id");
  CREATE INDEX "news_updated_at_idx" ON "news" USING btree ("updated_at");
  CREATE INDEX "news_created_at_idx" ON "news" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_news_media_fk" FOREIGN KEY ("news_media_id") REFERENCES "public"."news_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_news_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_news_media_id_idx" ON "payload_locked_documents_rels" USING btree ("news_media_id");
  CREATE INDEX "payload_locked_documents_rels_news_id_idx" ON "payload_locked_documents_rels" USING btree ("news_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "news_media" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "news_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "news" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "news_media" CASCADE;
  DROP TABLE "news_images" CASCADE;
  DROP TABLE "news" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_news_media_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_news_fk";
  
  DROP INDEX "payload_locked_documents_rels_news_media_id_idx";
  DROP INDEX "payload_locked_documents_rels_news_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "news_media_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "news_id";`)
}
