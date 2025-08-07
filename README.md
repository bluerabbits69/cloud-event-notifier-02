# cloud-event-notifier-02

（100本ノックの第2弾）

---

## 🚀 機能概要

- Azure Blob Storage にファイルがアップロードされると
- Event Grid がそのイベントを検知し
- Azure Functions（TypeScript）がトリガーされ
- Slack の Incoming Webhook に通知を送信します

## 📦 ディレクトリ構成

```
cloud-event-notifier-02/
├── src/functions/
│   └── NotifyUpload.ts       # Event Grid Trigger 関数本体
├── .env                      # ローカル用Webhook URL（dotenv）
├── package.json
├── tsconfig.json
├── local.settings.json       # Azure Functions ローカル設定
└── README.md
```

## 🔧 セットアップ手順

1. ローカルでの実行
```bash
npm install
npm run build
func start
```
.env に以下を記述：
```
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
```
---
2. Azureへのデプロイ

```bash
func azure functionapp publish func-cloud-notifier-02-dev
```
3. Slack Webhookの登録（Azure側）
```bash
az functionapp config appsettings set \
  --name func-cloud-notifier-02-dev \
  --resource-group <rg_name> \
  --settings SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
```

---
4. Event Grid Subscriptionの作成
```
az eventgrid event-subscription create \
  --name evsub-notifyupload-02 \
  --source-resource-id $(az storage account show \
    --name <strage_account_name> \
    --resource-group <rg_name> \
    --query id -o tsv) \
  --endpoint-type azurefunction \
  --endpoint /subscriptions/<YOUR_SUBSCRIPTION_ID>/resourceGroups/<rg_name>/providers/Microsoft.Web/sites/func-cloud-notifier-02-dev/functions/NotifyUpload
```

## ✨ 実行例（Slack通知）

📂 Blobがアップロードされました！

📝: /blobServices/default/containers/uploads/blobs/testfile.txt
🔗: https://<strage_account_name>.blob.core.windows.net/uploads/testfile.txt
📦: Microsoft.Storage.BlobCreated