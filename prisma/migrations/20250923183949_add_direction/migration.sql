-- CreateTable
CREATE TABLE "public"."timewarp" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" VARCHAR,
    "count" BIGINT,

    CONSTRAINT "time-warp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Direction" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "description" TEXT,

    CONSTRAINT "Direction_pkey" PRIMARY KEY ("id")
);
