import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Locations } from "./collections/Locations";
import { EmailTemplates } from "./collections/EmailTemplates";
import { Trainings } from "./collections/Trainings";
import { LeagueMedia } from "./collections/LeagueMedia";
import { LeagueSeasons } from "./collections/LeagueSeasons";
import { LeagueTeams } from "./collections/LeagueTeams";
import { LeagueEvents } from "./collections/LeagueEvents";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const s3GenerateFileURL =
  (prefix?: string) =>
  ({ filename, prefix: filePrefix }: { filename: string; prefix?: string }) => {
    const folder = filePrefix ?? prefix;
    const key = folder ? `${folder}/${filename}` : filename;
    return `${process.env.R2_PUBLIC_URL}/${key}`;
  };

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    Locations,
    EmailTemplates,
    Trainings,
    LeagueMedia,
    LeagueSeasons,
    LeagueTeams,
    LeagueEvents,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || "",
      connectionTimeoutMillis: 30000,
      idleTimeoutMillis: 30000,
    },
    push: process.env.PAYLOAD_DB_PUSH === 'true',
  }),
  sharp,
  plugins: [
    s3Storage({
      collections: {
        media: {
          disablePayloadAccessControl: true,
          generateFileURL: s3GenerateFileURL(),
        },
        'league-media': {
          prefix: 'league',
          disablePayloadAccessControl: true,
          generateFileURL: s3GenerateFileURL('league'),
        },
      },
      bucket: process.env.R2_BUCKET || '',
      config: {
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
        },
        region: 'auto',
        endpoint: process.env.R2_ENDPOINT,
        forcePathStyle: true,
      },
    }),
  ],
});
