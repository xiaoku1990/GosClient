/*
* tunnel(隧道的方法:)
* */
//添加连接方法
/*
* sPeerID:对端ID
*      (1，项目ID(首字符小写)+分区id(3位，不足3位就补0)+设备ID(5位，不足5位前面补0);
* sType：2,连接类型(固定0);
* 3:'0'(固定为0)
* sListenAddr:4, 侦听地址127.0.0.1:8421(固定);
* sClientAddr :5,连接地址:127.0.0.1:9000(端口可以固定(分配3个)用来拿数据)
* */

var g_back;

const tunnel={
    pgConnectAdd (sPeerID, sType, sEncrypt, sListenAddr, sClientAddr,back) {
      pgTunnelRequest("127.0.0.1:17881", "GET", ("cnntadd?peerid=" + sPeerID + "&type=" + sType + "&encrypt=" + sEncrypt + "&listenaddr=" + sListenAddr + "&clientaddr=" + sClientAddr), "", tunnel.pgTunnelCallback);
      g_back = back;

      //return g_back;
    },
    pgConnectDelete (sPeerID, sType, sEncrypt, sListenAddr, sClientAddr, back) {
        pgTunnelRequest("127.0.0.1:17881", "GET", ("cnntdelete?peerid=" + sPeerID + "&type=" + sType + "&encrypt=" + sEncrypt + "&listenaddr=" + sListenAddr + "&clientaddr=" + sClientAddr), "", tunnel.pgTunnelCallback);
        g_back = back;
    },
    pgConnectQuery(sClientAddr, back) {
      //  查询这个端口之前创建的隧道
        //pgTunnelRequest("127.0.0.1:17881", "GET", ("cnntquery?peerid=" + sPeerID + "&type=" + sType + "&encrypt=" + sEncrypt + "&listenaddr=" + sListenAddr + "&clientaddr=" + sClientAddr), "", tunnel.pgTunnelCallback);
        pgTunnelRequest("127.0.0.1:17881", "GET", ("cnntlclquery?clientaddr=" + sClientAddr), "", tunnel.pgTunnelCallback);
        g_back = back;
    },
    pgTunnelCallback(uStatus, sResp) {

      if(typeof(g_back) === 'function') {
        let rt;
            rt=sResp.substring(8);
            //console.log(rt);
        g_back(uStatus, rt);
        //console.log(g_back(uStatus, sResp));
      } else {
        console.log('not func');
      }


      //建立连接之后的回调
      // back=uStatus + " : " + sResp;
      //return result;

        if (uStatus != 200) {
            return;
        }

        var iInd = sResp.indexOf(':');
        if (iInd <= 0) {
            return;
        }

        var sMeth = sResp.substring(0, iInd);
        var oResp = eval("(" + sResp.substring(iInd + 1) + ")");
        if (sMeth == "domainget") {
            if (typeof(oResp.domain) != "undefined") {
                //	id_domain.value = oResp.domain;
            }
        }
        else if (sMeth == "domainset") {
            if (typeof(oResp.result) != "undefined") {
                if (oResp.result != "0") {
                    if (oResp.result == "2") {
                        alert("输入的识别码错误");
                    }
                    else if (oResp.result == "18") {
                        alert("输入的识别码不存在");
                    }
                    else if (oResp.result == "19") {
                        alert("该识别码所在域的客户端数量已经达到上限，请升级域的级别！");
                    }
                    else if (oResp.result == "10") {
                        alert("尚未登录");
                    }
                    else {
                        alert("设置识别码失败，错误码=" + oResp.result);
                    }
                }
                else {
                    pgCommentSet(id_comment.value);
                    alert("设置识别码成功");
                }
            }
        }
        else if (sMeth == "commentget") {
            if (typeof(oResp.comment) != "undefined") {
                id_comment.value = oResp.comment;
            }
        }
        else if (sMeth == "commentset") {
            if (typeof(oResp.result) != "undefined") {
                if (oResp.result != "0") {
                    pgCommentGet();
                    if (oResp.result == "2") {
                        alert("参数无效");
                    }
                    else {
                        alert("修改说明失败，错误码=" + oResp.result);
                    }
                }
                else {
                    // Success.
                }
            }
        }
        else if (sMeth == "remoteinvite") {
            if (typeof(oResp.result) != "undefined") {
                if (oResp.result == "0") {
                    alert("发送请求成功");
                }
                else if (oResp.result == "17") {
                    alert("当前已经在远程协助状态");
                }
                else if (oResp.result == "2") {
                    alert("参数错误");
                }
                else if (oResp.result == "10") {
                    alert("尚未登录");
                }
                else if (oResp.result == "18") {
                    alert("没有指定客服人员");
                }
                else if (oResp.result == "6") {
                    alert("客服人员不在线");
                }
                else {
                    alert("发送请求失败，错误码=" + oResp.result);
                }
            }
        }
        else if (sMeth == "capturectrl") {
            if (typeof(oResp.result) != "undefined") {
                if (oResp.result != "0") {
                    alert("触发抓屏失败，错误码=" + oResp.result);
                }
                else {
                    alert("触发抓屏成功");
                }
            }
        }
        else if (sMeth == "tunnelset") {
            if (typeof(oResp.result) != "undefined") {
                if (oResp.result != "0") {
                    if (oResp.result == "2") {
                        alert("输入的识别码错误");
                    }
                    else if (oResp.result == "18") {
                        alert("输入的识别码不存在");
                    }
                    else if (oResp.result == "19") {
                        alert("该识别码所在域的客户端数量已经达到上限，请升级域的级别！");
                    }
                    else if (oResp.result == "10") {
                        alert("尚未登录");
                    }
                    else {
                        alert("设置失败，错误码=" + oResp.result);
                    }
                }
                else {
                    alert("设置成功");
                }
            }
        }
    }
}

export default tunnel;
