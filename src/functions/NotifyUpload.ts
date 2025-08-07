import { app, EventGridEvent, InvocationContext } from "@azure/functions";
import axios from "axios";

export async function NotifyUpload(event: EventGridEvent, context: InvocationContext): Promise<void> {
    context.log('Event grid function processed event:', event);

    const { subject, eventType, data } = event;
    const blobUrl = (data as any)?.url;

    const slackMessage = {
        text: `📁 Blobがアップロードされました！ \n\n📝: ${subject}\n🔗: ${blobUrl}\n📦: ${eventType}`
    };

    try {
        await axios.post(process.env.SLACK_WEBHOOK_URL!, slackMessage);
        context.log("✅ Slack通知完了");
    } catch (err) {
        context.error("❌ Slack通知エラー", err);
    }
}

app.eventGrid('NotifyUpload', {
    handler: NotifyUpload
});
