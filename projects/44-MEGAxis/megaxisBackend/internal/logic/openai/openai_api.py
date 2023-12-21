import sys

import openai

openai.api_key = ''


def buildMsg(role, content):
    return {"role": role, "content": content}

def openAIReq():
    # print('send request to openai_api')
    argv = sys.argv[1:]
    #msg = []
    msg = [{"role": "system", "content": "You are a helpful assistant."},]
    for idx in range(len(argv)):
        if idx % 2 == 1:
            msg.append(buildMsg("system", argv[idx]))
        else:
            msg.append(buildMsg("user", argv[idx]))
    res = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=msg
    )
    # print(msg)
    print(res.choices[0].message.content)

try:
    openAIReq()
except Exception as e:
    print(e)
