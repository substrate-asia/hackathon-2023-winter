import { Row, Col, Image } from "react-bootstrap";
import RUNTIME from "../lib/runtime";

function Thumbnail(props) {

    const list = props.list;
    let dom = "";

    switch (list.length) {
        case 1:
            dom = (<Row>
                <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                    <Image src={RUNTIME.getAvatar(list[0])} rounded width="100%" />
                </Col>
            </Row>);
            break;
        case 2:
            dom = (<Row className="text-center">
                <Col style={{ marginTop: "10px",marginLeft:"1px"}} xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                    <Image src={RUNTIME.getAvatar(list[0])} rounded width="48%" />
                    <Image src={RUNTIME.getAvatar(list[1])} rounded width="48%" />
                </Col>
            </Row>);
            break;
        case 3:
            dom = (<Row className="text-center">
                <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                    <Image src={RUNTIME.getAvatar(list[0])} rounded width="48%" />
                </Col>
                <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                    <Image src={RUNTIME.getAvatar(list[1])} rounded width="48%" />
                    <Image src={RUNTIME.getAvatar(list[2])} rounded width="48%" />
                </Col>
            </Row>);
            break;
        case 4:
            dom = (<Row className="text-center">
                <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                    <Image src={RUNTIME.getAvatar(list[0])} rounded width="48%" />
                    <Image src={RUNTIME.getAvatar(list[1])} rounded width="48%" />
                </Col>
                <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                    <Image src={RUNTIME.getAvatar(list[2])} rounded width="48%" />
                    <Image src={RUNTIME.getAvatar(list[3])} rounded width="48%" />
                </Col>
            </Row>);
            break;
        case 5:
            dom = (<Row className="text-center">
                <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                    <Image src={RUNTIME.getAvatar(list[0])} rounded width="32%" />
                    <Image src={RUNTIME.getAvatar(list[1])} rounded width="32%" />
                </Col>
                <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                    <Image src={RUNTIME.getAvatar(list[2])} rounded width="32%" />
                    <Image src={RUNTIME.getAvatar(list[3])} rounded width="32%" />
                    <Image src={RUNTIME.getAvatar(list[4])} rounded width="32%" />
                </Col>
            </Row>);
            break;
        case 6:
            dom = (<Row className="text-center">
                <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                    <Image src={RUNTIME.getAvatar(list[0])} rounded width="32%" />
                    <Image src={RUNTIME.getAvatar(list[1])} rounded width="32%" />
                    <Image src={RUNTIME.getAvatar(list[2])} rounded width="32%" />
                </Col>
                <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                    <Image src={RUNTIME.getAvatar(list[3])} rounded width="32%" />
                    <Image src={RUNTIME.getAvatar(list[4])} rounded width="32%" />
                    <Image src={RUNTIME.getAvatar(list[5])} rounded width="32%" />
                </Col>
            </Row>);
            break;
        case 7:
            dom = (<Row>
                <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                    <Image src={RUNTIME.getAvatar(props.group)} rounded width="100%" />
                </Col>
            </Row>);
            break;
        case 8:
            dom = (<Row>
                <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                    <Image src={RUNTIME.getAvatar(props.group)} rounded width="100%" />
                </Col>
            </Row>);
            break;
        case 9:
            dom = (<Row>
                <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                    <Image src={RUNTIME.getAvatar(props.group)} rounded width="100%" />
                </Col>
            </Row>);
            break;
        default:

            break;
    }

    return (<div className={!props.group?"thumbsingle":"thumbgroup"} >{dom}</div>);
}

export default Thumbnail;