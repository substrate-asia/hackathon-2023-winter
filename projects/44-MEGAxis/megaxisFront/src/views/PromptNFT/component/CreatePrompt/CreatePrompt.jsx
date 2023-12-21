import React, { useState } from "react";
import "./CreatePrompt.css"
import {Button, Form, Input, Radio, Select, Row, Col, message} from "antd";
import TextArea from "antd/es/input/TextArea";
import {makePrompt} from "../../../../api/PromptNFT";
import {useMoralis, useWeb3Contract} from "react-moralis"
import {useEffect} from "react"
import PromptNftAbi from "../../../../constants/BasicNft.json"
import "../../../../styles/index.css"
import Sidebar from "../../../../layout/sidebar";
import Navbar from "../../../../layout/navbar";

const CreatePrompt = () => {
    // const { promptForm, setPromptForm } = useState({});
    const [token, setToken] = useState('')
    const marketplaceAddress = "0x14885d2e6E06E6f2Fb11b4dA28D9e7c300DA4163";
    const {enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading} = useMoralis()
    useEffect(() => {
        if (isWeb3Enabled) return
        if (typeof window !== "undefined") {
            if (window.localStorage.getItem("connected")) {
                enableWeb3()
            }
        }
        console.log("Hi")
        console.log(isWeb3Enabled)
    }, [isWeb3Enabled])
    // auto run on load

    useEffect(() => {
        Moralis.onAccountChanged((account) => {
            console.log(`Account change to ${account}`)
            if (account == null) {
                window.localStorage.removeItem("connected")
                deactivateWeb3()
                console.log("Can not found account!")
            }
        })
    }, [isWeb3Enabled])

    const { runContractFunction: buyItem } = useWeb3Contract({
        abi: PromptNftAbi,
        contractAddress: marketplaceAddress,
        functionName: "mintNft",
        msgValue: 0,
        params: {
        },
    })

    const typeOptions = [
        {value: 1, label: 'General' },
        {value: 2, label: 'Academic'},
        {value: 3, label: 'Marketing'},
        {value: 4, label: 'Software Development'},
        {value: 5, label: 'Business'},
        {value: 6, label: 'Other'},
    ]
    const [form] = Form.useForm();
    const onFinish = async (values) => {
        await getToken()
        values['nftId'] = token.toString();
        console.log("values, ", values)
       makePrompt(values).then(res => {
            console.log(res);
            if(res.code === 0) {
                message.success('Success');
            } else {
                message.error('This is an error message');
            }
       });
    };

    const getToken = async () =>{
        await enableWeb3()
        if (typeof window !== "undefined") {
            console.log("test")
            window.localStorage.setItem("connected", "injected");
            const mintTx = await buyItem({
                onError: (error) => console.log(error),
                onSuccess: () => {message.success("success!")},
            })
            const mintTxReceipt = await mintTx.wait(1)
            const tokenId = mintTxReceipt.events[0].args.tokenId;
            console.log("tokenid: ", tokenId)
            setToken(tokenId);

        }
    }

    const [messageApi, contextHolder] = message.useMessage();
    function onFormLayoutChange() {

    }

    const labelInfoUser=<span style={{color:'white',fontSize:15,fontWeight:'bolder'}}>Promptname</span>
    // const labelInfoUser=<span style={{color:'white',fontSize:15,fontWeight:'bolder'}}>Promptname</span>
    // const labelInfoUser=<span style={{color:'white',fontSize:15,fontWeight:'bolder'}}>Promptname</span>
    // const labelInfoUser=<span style={{color:'white',fontSize:15,fontWeight:'bolder'}}>Promptname</span>
    // const labelInfoUser=<span style={{color:'white',fontSize:15,fontWeight:'bolder'}}>Promptname</span>

    return (
        <div>
            <Sidebar />
            <div className="right-side">
                <Navbar />
                <div className="lower">
                    <div className="form-container">

                        <div className="form-window">
                            <div className="create-title"> Create your own PROMPT now!!!</div>
                            <Form
                                layout="vertical"
                                form={form}
                                onValuesChange={onFormLayoutChange}
                                style={{
                                    maxWidth: 600,
                                    margin: '20px auto',
                                }}
                                onFinish={onFinish}
                            >
                                <Form.Item
                                    label={labelInfoUser}
                                    name="prompt_name"

                                >
                                    <Input placeholder="Cold Email Generator"
                                       style={{
                                           color: 'white',
                                           '::placeholder': {
                                               color: 'white'
                                           }
                                       }}
                                    />
                                </Form.Item>

                                <Row>
                                    <Col span={12}>
                                        <div style={{ display: 'flex' }}>
                                            <Form.Item label="Price" name="price" className="custom-form-item-label">
                                                <Input placeholder="0.00" style={{ width: 250 }} />
                                            </Form.Item>
                                        </div>
                                    </Col>
                                    <Col span={12}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <Form.Item
                                            label='Type'
                                            name="type"
                                            className="custom-form-item-label"
                                        >
                                            <Select
                                                placeholder="Type or Select Tag"
                                                style={{ width: 250 }}
                                                options={typeOptions}
                                            />
                                        </Form.Item>
                                        </div>
                                    </Col>
                                </Row>

                                <Form.Item label="Description" name="desc" className="custom-form-item-label">
                                    <TextArea
                                        placeholder="Helping individuals or businesses create effectiveand personalized email messages to reach out topotential customers or clients who may have noprior connection or relationship with them."
                                        style={{ height: 120, resize: 'none' }}
                                    />

                                </Form.Item>


                                <Form.Item label="Prompt" name="content" className="custom-form-item-label">
                                    <TextArea
                                        placeholder="Write an article discussing the benefits andlimitations of using a cold email generator for yourbusiness outreach efforts. Provide examples of howit can be helpful and situations where it may not bethe best approach. Additionally, provide tips on howto maximize the effectiveness of cold emailsgenerated by the tool."
                                        style={{ height: 120, resize: 'none' }}
                                    />
                                </Form.Item>

                                <Button type="primary" htmlType="submit" className="custom-gradient-button"
                                        disabled = {isWeb3EnableLoading}
                                >
                                    Submit
                                </Button>

                            </Form>
                        </div>
                    </div>
                </div >
            </div>
        </div>
    );
};

export default CreatePrompt;
