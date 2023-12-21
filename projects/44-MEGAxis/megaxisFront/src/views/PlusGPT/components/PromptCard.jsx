
import './PromptCard.css'
import { ReactComponent as EyeLine } from '../../../../src/assets/icon/eye-line.svg';
import { ReactComponent as MsgLine } from '../../../../src/assets/icon/message-line.svg';
import { ReactComponent as TbUPLine } from '../../../../src/assets/icon/thumb-up-line.svg';
import { ReactComponent as TbUPFill } from '../../../../src/assets/icon/thumb-up-fill.svg';
import { ReactComponent as TbDOWNLine } from '../../../../src/assets/icon/thumb-down-line.svg';
import { ReactComponent as TbDOWNFill } from '../../../../src/assets/icon/thumb-down-fill.svg';
import { ReactComponent as LinkLine } from '../../../../src/assets/icon/links-line.svg';
import { ReactComponent as AlertLine } from '../../../../src/assets/icon/alert-line.svg';
import { ReactComponent as StarLine } from '../../../../src/assets/icon/star-line.svg';
import { ReactComponent as StarFill } from '../../../../src/assets/icon/star-fill.svg';

import React,  {useEffect, useState} from 'react';
import { formatNumber } from "../../../utils/validate";
import {likePrompt} from "../../../api/PromptNFT";
import {Link} from 'react-router-dom';
import { truncateString } from "../../../utils/tools"
//props:
//      {
//     "pid": 2000,
//     "prompt_name":"",
//     "creator": "",   // 作者的username
//     "price": "",
//     "update_time": "",
//     "desc": "",
//     "img_url": "",      // url
//
//     // 以下可暂时不用
//     "views": 1000,
//     "likes": 1000,
//     "comments": 1000
//     },
//     {}
const PromptCard = (props = PromptCard.defaultProps) => {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [stared, setStared] = useState(false);
  const [likes, setLikes] = useState(props.props.likes);
  const [desc, setDesc] = useState('');

  useEffect(() => {
    console.log(props)
    setDesc( truncateString(props.props.desc, 140));
  }, [props])

  const handleLikeClick = () => {
    if (liked) {
      const req = {
        pid: props.props.pid,
        like: 0
      };
      likePrompt(req).then(res => {
        setLiked(false);
        setLikes(likes - 1); // 减少1个赞
      });
    } else {
      const req = {
        pid: props.props.pid,
        like: 1
      };
      likePrompt(req).then(res => {
        setLiked(true);
        setDisliked(false);
        setLikes(likes + 1); // 增加1个赞
      });
    }
  };

  const handleDislikeClick = () => {
    if (disliked) {
      const req = {
        pid: props.props.pid,
        like: 0
      };
      likePrompt(req).then(res => {
        setDisliked(false);
        if (liked) {
          setLikes(likes - 1); // 如果之前点过赞，减少1个赞
        }
      });
    } else {
      const req = {
        pid: props.props.pid,
        like: -1
      };
      likePrompt(req).then(res => {
        setDisliked(true);
        setLiked(false);
        if (liked) {
          setLikes(likes - 1); // 如果之前点过赞，减少1个赞
        }
      });
    }
  };

  // function transToDetail() {
  //   const history = useHistory();
  //   history.push()
  // }
  function formatPrice(num) {
    if(num <=0) {
      return 'Free';
    } else {
      return '$' + num;
    }
  }
  return (
    <div onClick={props.onClick}>
      <div className="prompt-card">
        <div className="label">{formatPrice(props.props.price)}</div>
        <div className="labels-right">
          <div className="icon-container">
            <AlertLine className="icon-alert" />
            <div  onClick={() => setStared(!stared)}>
              {stared ? <StarFill className="icon-star" /> : <StarLine className="icon-star" />}
            </div>
          </div>
        </div>


        <div className="detail-box">
          <div className="imgbox">
            <div className="bkg" style= {{ backgroundImage: `url(${props.props.avatar})`, backgroundSize: "cover", backgroundRepeat: "no-repeat" }}></div>
          </div>

          <div className="message">
            <div className="title">
              <Link className="title" style={{textDecoration: "none"}} to={"/detail/" +props.props.pid}>
                {props.props.name}
              </Link>
            </div>
            <div className="class0">
              <a href="#" className="link0">
                {props.props.author ? (props.props.author.length > 5
                    ? props.props.author.slice(0, 4) + "..." + props.props.author.slice(-4)
                    : props.props.author) :'Loading'}
              </a>
            </div>
            <div className="namecol">
              <div className="name">
                #{props.props.nftid}
                {/*<a href="#" className="link">*/}
                {/*  {props.props.author? (props.props.author.length > 5*/}
                {/*      ? props.props.author.slice(0, 4) + "..." + props.props.author.slice(-4)*/}
                {/*      : props.props.author):'Loading'}*/}
                {/*</a>*/}
              </div>
              <div className="time">{props.props.createTime ? props.props.createTime.substring(0, 10):'Loading...'}</div>
            </div>
            {/*<div className="details">{props.props.desc?props.props.desc:"这个用户很懒，还没有写简介"}</div>*/}
            <div className="details">{desc?desc:"这个用户很懒，还没有写简介"}</div>
          </div>
        </div>
        <div className="bottombar">
          <div className="icon-container">
            <EyeLine className="icon0" />
            <span className="icon-text">500k</span>
          </div>
          <div className="icon-container">
            <MsgLine className="icon0" />
            <span className="icon-text">500k</span>
          </div>
          <div className="icon-container" >
            <div onClick={handleLikeClick}>
              {liked ? <TbUPFill className="icon0"/> : <TbUPLine className="icon0"/>}
            </div>
            < span className="icon-text">{formatNumber(likes)}</span>

          <div onClick={handleDislikeClick} className="righticon">
              {disliked ? <TbDOWNFill className="icon1"/> : <TbDOWNLine className="icon1"/>}
            </div>
          </div>


          <div className="icon-container">
            <LinkLine className="icon-last" />
          </div>

        </div>
      </div>

    </div>
  )
}
PromptCard.defaultProps = {
  props: {
    pid: "2000st",
    prompt_name: "Let's do",
    creator: "Frank",
    author: "Frank",// 作者的username
    price: 200,
    update_time: "2022-12-20",
    desc: "A prompt that’s useful for every task.",
    likes: 1000,
    nftid: 1,
//     "img_url": "",      // url
//     // 以下可暂时不用
//     "views": 1000,

//     "comments": 1000
  }
}

export default PromptCard
