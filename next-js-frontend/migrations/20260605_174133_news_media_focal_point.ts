import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_news_media_focal_point" AS ENUM('center', 'top', 'bottom', 'left', 'right');
  ALTER TABLE "news_media" ADD COLUMN "focal_point" "enum_news_media_focal_point" DEFAULT 'center';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "news_media" DROP COLUMN "focal_point";
  DROP TYPE "public"."enum_news_media_focal_point";`)
}
