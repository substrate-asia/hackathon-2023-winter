# from common.utils import gen_special_img, get_captcha_text
from sqlalchemy.log import Identified
from common.response_bean import ResponseBean, CodeConst
import json
from common.base_handler import BaseHandler
from service.bot_service_float import BotService
import tornado.web
import requests

from handler.predict import *

class masknetwork(BaseHandler):
    # botservice = BotService()

    def post(self):
        pass

    def get(self):  # ok
        param = "get测试接口"
        name = self.get_argument("didname")
        query="""
            query findOneNFTWithOwnerNeighbor {
            nft(chain: "ethereum", category: ENS, id: "sujiyan.eth") {
                owner {
                platform
                identity
                nft {
                    category
                    chain
                    id
                }
                neighborWithTraversal(depth: 5) {
                    ... on ProofRecord {
                    source
                    from {
                        platform
                        identity
                        uuid
                    }
                    to {
                        platform
                        identity
                        uuid
                    }
                    }
                    ... on HoldRecord {
                    source
                    from {
                        platform
                        identity
                        uuid
                    }
                    to {
                        platform
                        identity
                        uuid
                    }
                    }
                }
                }
            }
            }
            """
        result = self.run_query(query)
        
        # return result
    
        self.write(json.dumps(result, ensure_ascii=False))

        return

    def run_query(self, query):
        request = requests.post('https://relation-service.nextnext.id/', json={'query': query})
        if request.status_code == 200:
            return request.json()
        else:
            raise Exception("Query failed to run by returning code of {}. {}".format(request.status_code, query))

    def options(self):
        self.write('{"errorCode":"00","errorMessage","success"}')
