import React, {useCallback,useEffect, useState} from "react";
import {useParams} from "react-router";
import '../Welcome/Welcome.css';
import image from '../../assets/background/abc.png';

import { Link } from "react-router-dom"
import { Card, List, Modal, notification, Pagination } from "antd"
import { FaPaperPlane } from "react-icons/fa"
import { ReactComponent as Close } from "../../assets/icon/close-line 1.svg"
import PromptCard from "../../../src/views/PlusGPT/components/PromptCard"
import { askGPT } from "../../api/PlusGPT"
import { getFavorites, getBought, getByType, getByKey, getDetail, purchase } from "../../api/PromptNFT"
import { getToken } from "../../utils/auth"
import { TypeContext } from "../../layout"
import { ReactComponent as TbUPLine } from '../../../src/assets/icon/thumb-up-line.svg'
import { ReactComponent as TbDOWNLine } from '../../../src/assets/icon/thumb-down-line.svg'
import { Spin } from 'antd';
import PlusGPT from "../PlusGPT/PlusGPT copy";




const Welcome = () => {
    return (
        <div className="container">
            <div className="image-container">
                <img src={image} alt="Background" />
            </div>
            <div className="chat-container">
                <PlusGPT/> 
            </div>
        </div>
    );
}
    


export default Welcome;