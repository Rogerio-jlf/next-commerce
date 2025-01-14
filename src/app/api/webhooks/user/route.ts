import prisma from "../../../../lib/prisma";
import { IncomingHttpHeaders } from "http";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook, WebhookRequiredHeaders } from "svix";

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || "";

type EventType = "user.created" | "user.updated" | "*";

type Event = {
  data: EventDataType;
  object: "event";
  type: EventType;
};

type EventDataType = {
  id: string;
  first_name: string;
  last_name: string;
  email_addresses: EmailAddressesType[];
  primary_email_addresses_id: string;
  attributes: Record<string, string | number>;
  name: string;
};

type EmailAddressesType = {
  id: string;
  email_addresses: string;
};

async function handler(request: Request) {
  const payload = await request.json();
  const headersList = await headers();
  const heads = {
    "svix-id": headersList.get("svix-id"),
    "svix-timestamp": headersList.get("svix-timestamp"),
    "svix-signature": headersList.get("svix-signature"),
  };
  const wh = new Webhook(webhookSecret);
  let evt: Event | null = null;

  try {
    evt = wh.verify(
      JSON.stringify(payload),
      heads as IncomingHttpHeaders & WebhookRequiredHeaders
    ) as Event;
  } catch (err) {
    console.error((err as Error).message);
    return NextResponse.json({}, { status: 400 });
  }

  const eventType: EventType = evt.type;

  if (eventType === "user.created" || eventType === "user.updated") {
    const {
      id,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      first_name,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      last_name,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      email_addresses,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      primary_email_addresses_id,
      ...attributes
    } = evt.data;

    await prisma.user.upsert({
      where: {
        externalId: id as string,
      },
      create: {
        externalId: id as string,
        attributes,
      },
      update: {
        attributes,
      },
    });
  }

  return NextResponse.json({}, { status: 200 });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;

// 02:05:00
