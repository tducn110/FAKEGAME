import json

log_file = "/home/pro/.gemini/antigravity-cli/brain/326a87e4-6b1c-4442-8424-bfa73a81a4d5/.system_generated/logs/transcript_full.jsonl"
with open(log_file, "r") as f:
    for line in f:
        data = json.loads(line)
        if data.get("type") in ["TOOL_RESPONSE", "RUN_COMMAND"]:
            content = data.get("content", "")
            if isinstance(content, list):
                text_content = ""
                for c in content:
                    if isinstance(c, dict) and "text" in c:
                        text_content += c["text"]
                content = text_content
            elif isinstance(content, str):
                pass
            
            if "export function CardGame" in content:
                with open("CardGame_Original.txt", "w") as out:
                    out.write(content)
                print("Dumped!")
                break
