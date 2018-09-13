var module = (function () {

  var build;
  var floor;
  var floorName;//楼层名

  var OlBuildId;
  var OlFloorId;
  var olMapType;//地图类型
  var timeDate;//时间对象包含(startTime,endTime)
  var OlWidth;//项目宽
  var OlHeight;//项目的高
  var OlFloorNum;
  var OlFloorIdIndex;
  var sourceInterPoint;
  var sourceLight;
  var url = 'http://139.196.5.153:8080';
  var dataurl = 'http://139.196.5.153:8080';
  var mapUrl = 'http://139.196.5.153:8181/geoserver/wms?';
  //var localUrl = 'http://192.168.0.100:8421';
  //var localUrl='http://127.0.0.1:8007';
  var localUrl;
  //
  var carRuleIndex;//用于违规车辆提示

  var carMapDate;
  var carStateDate;
  var carStateInter;//定时刷新车位状态
  var carUseDate;//车位利用率

//:創建楼层控件
//var body=document.body;
//var body=document.getElementById('map');

  var up = document.createElement('div');
  up.setAttribute('id', 'up');
  // up.setAttribute('@click=',"clickSuccess()");
  var upImg = document.createElement('img');
  //./src/assets/images/img/up.png"
  //img/up,.png
  upImg.setAttribute('src', '../../../static/img/up.png');

  up.appendChild(upImg);
//:down
  var down = document.createElement('div');
  down.setAttribute('id', 'down');
  var downImg = document.createElement('img');
  downImg.setAttribute('src', '../../../static/img/down.png');
  down.appendChild(downImg);

//:
  /*var floor = document.createElement('div');
  floor.setAttribute('id', 'floor');
  var floorUl = document.createElement('ul');
  floorUl.setAttribute('id', 'floorUl');*/
  var floorUl;


//-----------------------------


//:视频摄像头要素类:
  var Camera = function (build, floorId, date) {
    //


    this.build_id = build;
    this.floor_id = floorId;
    this.cameraUrl = "http:192.168.0.109";
    this.param = date.param;
    this.type = 'camera';
    this.coordinates = date.coordinates;
    this.setCameraStyle = function () {
      var style = new ol.style.Style({
        image: new ol.style.Icon({
          src: "../../../static/img/22/main/noconfig/21@3x.png",
          scale: 0.55
        })
      });
      //return style;
      this.setStyle(style);
    };

  };//
//:车位要素类:
//:carMapdate (车位状态数据)
  //:carCountDate (车位数量数据)
  var BasicCar = function (build, floorId, carDate) {
    this.build_id = build;
    this.floor_id = floorId;
    this.type = 'car';
    //console.log(carMapDate);
    this.carArea = carDate.carArea;
    this.carFloor = carDate.carFloor;
    this.carFloorID = carDate.carFloorID;
    this.carNum = carDate.carNum;
    this.carUID = carDate.carUID;
    this.carposPoint = carDate.carposPoint;
    this.coordinates = carDate.coordinates;
    //
    this.car_state="";
    this.car_number="";
    this.car_enterTime="";
    this.car_picUrl="";
    this.car_videoUrl="";
  /*  carFeature.prototype.car_state=carMapDate.carpos_Info[e].car_state;
    carFeature.prototype.car_number=carMapDate.carpos_Info[e].car_number;
    carFeature.prototype.car_enterTime=carMapDate.carpos_Info[e].car_enterTime;
    carFeature.prototype.car_picUrl=carMapDate.carpos_Info[e].car_picUrl;
    carFeature.prototype.car_videoUrl=carMapDate.carpos_Info[e].car_videoUrl;*/
    //
    this.setCarColor = function (color) {
      var style = new ol.style.Style({
        fill: new ol.style.Fill({
          color: color
        }),
        stroke: new ol.style.Stroke({
          width: 1,
          color: 'white'
        }),
        text: new ol.style.Text({
          font: '10px sans-serif',
          //add carText;
          text: carDate.carNum,
          textAlign: 'center',
          fill: new ol.style.Fill({
            color: 'black'
          })
        })
      });
      //return style;
      this.setStyle(style);
    };
    //

    };
//:carCountDate (车位数量数据)
  var Car = function (build, floorId, carDate, carMapDate,carUseDate,carCountDate) {
    this.build_id = build;
    this.floor_id = floorId;
    this.type = 'car';
    //console.log(carMapDate);
    //if(carMapDate!=""&&carMapDate!=undefined&&carMapDate!=null){
      this.carArea = carDate.carArea;
      this.carFloor = carDate.carFloor;
      this.carFloorID = carDate.carFloorID;
      this.carNum = carDate.carNum;
      this.carUID = carDate.carUID;
      this.carposPoint = carDate.carposPoint;
      this.coordinates = carDate.coordinates;
      this.car_state = carMapDate.car_state;
      this.car_enterTime = carMapDate.car_enterTime;
      this.car_picUrl = carMapDate.car_picUrl;
      this.car_videoUrl = carMapDate.car_videoUrl;
    //}else {
      this.carNum=carUseDate.carpos_name;
      this.carFloorID=carUseDate.carpos_floorID;
      this.carUID=carUseDate.carpos_gid;
      this.carRatio=carUseDate.carpos_ratio;
    //};

    this.setCarColor = function (color) {
      var style = new ol.style.Style({
        fill: new ol.style.Fill({
          color: color
        }),
        stroke: new ol.style.Stroke({
          width: 1,
          color: 'white'
        })

      });
      //return style;
      this.setStyle(style);
    };

  };//
//:车位号要素类:
  var CarPort = function () {
    this.setPortColor = function (carDate,carNum, align, color) {
      this.type = 'carPoint';
      //console.log(carMapDate);
      this.carArea = carDate.carArea;
      this.carFloor = carDate.carFloor;
      this.carFloorID = carDate.carFloorID;
      this.carNum = carDate.carNum;
      this.carUID = carDate.carUID;
      this.carposPoint = carDate.carposPoint;
      this.coordinates = carDate.coordinates;

      var stylePoint = new ol.style.Style({
        text: new ol.style.Text({
          font: '10px sans-serif',
          //add carText;
          text: carNum,
          textAlign: align,
          fill: new ol.style.Fill({
            color: color
          })
        })
      })

      //return style;
      //console.log(carNum+' '+align+' '+color);
      this.setStyle(stylePoint);

    };
  };//
//:
//:车位号要素类:
  var CarEventPort = function (carDate) {
    this.type = 'carEvent';
    //console.log(carMapDate);
    this.carArea = carDate.carArea;
    this.carFloor = carDate.carFloor;
    this.carFloorID = carDate.carFloorID;
    this.carNum = carDate.carNum;
    this.carUID = carDate.carUID;
    this.carposPoint = carDate.carposPoint;
    this.coordinates = carDate.coordinates;
    this.car_state="";
    this.car_number="";
    this.car_enterTime="";
    this.car_picUrl="";
    this.car_videoUrl="";

    this.setPortColor = function (carNum, align, color) {


      var stylePoint = new ol.style.Style({
        text: new ol.style.Text({
          font: '10px sans-serif',
          //add carText;
          text: carNum,
          textAlign: align,
          fill: new ol.style.Fill({
            color: color
          })
        })
      })

      //return style;
      //console.log(carNum+' '+align+' '+color);
      this.setStyle(stylePoint);

    };
  };//
//:兴趣点层要素类
  var InterLayer = function (interDate) {
    this.inpointFloorID = interDate.inpointFloorID;
    this.inpointID = interDate.inpointID;
    this.inpointType = interDate.inpointType;
    this.inpointName = interDate.inpointName;
    this.inpointfloor = interDate.inpointfloor;
    this.coordinates = interDate.coordinates;
    this.setInterImg = function (interType) {
      var interStyle = new ol.style.Style({
        image: new ol.style.Icon({
          src: '../../../static/img/info/' + interType + '@3x.png',
          //imgSize:[35,35],
          scale: 0.25
        })
      });
      this.setStyle(interStyle);
    };
  };//

//:

  var getBuildInfo = function (url, cityId , buildId) {
    //获取项目相关数据
    $.ajax({
      cache: false,
      type: 'POST',
      async: false,
      dataType: 'json',
      data: {
        'cityID':'',
        'buildingID': buildId
      },
      url: '' + url + '/mapserve/floor',
      // url:''+dataurl+'/SttingParam/LightParam?build_id='+buildligId+"&floor="+newFloorId,
      success: function (result) {

        var buildResult=result;
        //console.log(buildResult);
        if (buildResult.result == 1) {
          OlWidth=buildResult.olmapWidth;
          OlHeight=buildResult.olmapHeight;
        } else {
          console.log('返回数据失败!');
        };
        //
      },
      error: function (xhr, status, error) {
        if (xhr.statusText == "timeout") {
          //img.innerHTML="请求超时!";
          console.log('请求超时!');
        } else {
          //img.innerHTML="服务器出错!";
          console.log('服务器出错!');
        }
        ;
      }

    });//$.ajax({

  };//GetBuildInfo
//
  //console.log('getBuildInfo');
  getBuildInfo(dataurl,'F00512','B0009' + '');

//兼容3.0(lightConfig)
  var versionThree = function (buildId, floorId, lightParamData) {

    for (var lightIndex = 0; lightIndex < lightParamData.param_list.length; lightIndex++) {

      //--------------------------------------------------
      var flag = lightParamData.param_list[lightIndex].flag;
      var dev_type = lightParamData.param_list[lightIndex].param.dev_type;
      //-------------------------------------------------
      if (dev_type == 7 || dev_type == 2) {
        var imgSrc = dev_type + flag;
        //----------------获取设备坐标------------------------------
        //var x=lightParamData.param_list[lightIndex].coordinates[0];
        //var y=lightParamData.param_list[lightIndex].coordinates[1];
        //
        Camera.prototype = new ol.Feature({});

        // console.log(lightParamData.param_list[lightIndex]);

        var cameraDevice = new Camera(buildId, floorId, lightParamData.param_list[lightIndex]);
        // console.log(cameraDevice);
        cameraDevice.setGeometry(new ol.geom.Point(cameraDevice.coordinates));
        cameraDevice.setCameraStyle();
        //---------------------添加主设备图标----------------------------------------
        sourceLight.addFeature(cameraDevice);
        deviceLayer.setSource(sourceLight);
      }
      ;//if()

      //---------------------------------------------------------
      //------------------------
      // console.log(Findex);
      //----------------------------------------------------------
    }
    ;
  };//versionThree
//:
  var beefindDevice = function (dataurl, buildId, floorId) {
    sourceLight = new ol.source.Vector();
    //每层的设备数据
    $.ajax({
      cache: false,
      type: 'POST',
      async: false,
      dataType: 'json',
      data: {
        'build_id': buildId,
        'floor': floorId
      },
      url: '' + dataurl + '/SttingParam/LightParam?',
      // url:''+dataurl+'/SttingParam/LightParam?build_id='+buildligId+"&floor="+newFloorId,
      success: function (result) {
        var lightParamData = result;
        //console.log(lightParamData);
        //alert(system_v);

        if (lightParamData.result == 1) {
          // alert(3333);
          versionThree(buildId, floorId, lightParamData);
        } else {
          console.log('返回数据失败!');
        }
        ;
        // console.log(system_v);
        //==================================版本兼容============================================================

        //==============================================================================================
      },
      error: function (xhr, status, error) {
        if (xhr.statusText == "timeout") {
          //img.innerHTML="请求超时!";
          console.log('请求超时!');
        } else {
          //img.innerHTML="服务器出错!";
          console.log('服务器出错!');
        };
      }

    });//$.ajax({

  };//beefindDevice
//:
//blist接口
  var buildParam = function (url, cityId, buildId, floorId, mapUrl,mapType) {
    build = [];
    $.ajax({
      cache: false,
      type: 'POST',
      async: false,
      dataType: 'json',
      url: '' + url + '/mapserve/bllist?',
      data: {
        cityID: cityId
      },
      timeout: 3500,
      success: function (result) {
        //console.log(JSON.stringify(result));
        for (var y = 0; y < result.response.length; y++) {
          //console.log(y);
          build[y] = new Object();
          build[y].buildingType = result.response[y].builingType;
          build[y].buildingId = result.response[y].buildingID;
          build[y].buildingName = result.response[y].buildingName;
          build[y].position = result.response[y].position;
          build[y].locateOffest = result.response[y].locateOffest;
          build[y].defineangel = result.response[y].defineangel;
          build[y].olmapCenter = result.response[y].olmapCenter;

          build[y].olmapHeight = result.response[y].olmapHeight;
          build[y].olmapWidth = result.response[y].olmapWidth;
          //build[y].buildingType=result.response[y].buildingType;
          build[y].system_verson = result.response[y].system_verson;
          build[y].index = y;


          //-----------------------------------------------------
          if (build[y].buildingId == buildId) {
            //console.log(y);
            var olZoom;
            var olMapCenter;
            if (build[y].olmapHeight == 91548) {
              olZoom = (91548 / build[y].olmapHeight) * 9.55;
            } else {
              olZoom = (91548 / build[y].olmapHeight) * 9.55 * 0.23;
            };
            // if(listCity[a].Build[b].olMapHeight==91548)
            //olMapCenter=build[y].olmapCenter;
            olMapCenter = [parseFloat(build[y].olmapWidth / 2), -parseFloat(build[y].olmapHeight / 2)];
            //alert(olMapCenter);
            //console.log(olMapCenter);
            map.getView().setCenter(olMapCenter);
          }
          ;//
          // createList();
        }
        ;//for
        //console.log(buildId);
        //------------------------------------------------------------
        mapserveFloor(url, cityId, buildId, floorId, mapUrl,mapType);

      },
      error: function (xhr, status, error) {
        if (xhr.statusText == "timeout") {
          console.log('请求超时!');
        } else {
          console.log('服务器出错!');
        }
        ;
      }
    });//$.ajaxbuild
    //console.log(build);
  };//
//
//:樓層控件點擊
  var j = 0;
  var downFloor = function (callback) {
    //:
    var floorHeight = $("#floorUl").height() - 35;//获取滚动框自己的高度
    //alert($("#floor").offset().top+2);
    var floorOutTop = $("#floor").offset().top + 2 - 35;//floor距离顶部的距离
    var scrollTop = $("#floorUl").offset().top;//距离滚动框的距离
    var top = $('#floor').offset().top;
    var marTop = scrollTop - top;

    var floorLiTop = $('#floorUl li').offset().top - top - 2;
    //
    if (-marTop >= floorHeight) {
      $("#floorUl").css('top', -floorHeight + 'px');
    } else {
      j++;
      //
      $("#floorUl").css('top', '-' + 35 * j + 'px');
    }
    ;
    //
    //----------------------------------------
    for (var v = 0; v < floor.length; v++) {

      var floorLiTop = $('#' + floor[v].floorId).offset().top - floorOutTop;
      if (floorLiTop > 0 && floorLiTop <= 35) {

        $('#' + floor[v].floorId).css({'color': 'red', 'font-size': '24px'});
        //alert(floor[v].floorUrl);
        //---------------------------
        loadMap(mapUrl, floor[v].floorUrl);
        OlFloorId = floor[v].floorId;
        OlFloorNum = floor[v].floorNum;

        floorName = floor[v].floorName;
        BeefindMap.prototype.floor = floorName;
        BeefindMap.prototype.floorId = OlFloorId;
        //
        beefindCar(url, OlBuildId, floor[v].floorId,olMapType);
        beefindDevice(dataurl, OlBuildId, floor[v].floorId);
      } else {

        $('#' + floor[v].floorId).css({'color': 'black', 'font-size': '18px'});
      }
      ;//

    }
    ;
    //console.log(floorName);
    return callback(floorName,OlFloorId);
    //:
  };//floorUp;
//:
  var upFloor = function (callback) {
    var floorHeight = $("#floorUl").height() - 35;//获取滚动框自己的高度
    var scrollTop = $("#floorUl").offset().top;//距离滚动框的距离
    var floorOutTop = $("#floor").offset().top + 2 - 35;//floor距离顶部的距离
    var top = $('#floor').offset().top;
    var marTop = scrollTop - top;
    // alert(marTop);
    var floorLiTop = $('#floorUl li').offset().top - top - 2;
    if (-marTop <= 0) {
      $("#floorUl").css('top', 0 + 'px');
      j = 0;
    } else {
      j--;
      // if(j<=0) j=0;
      // alert(-marTop+'j'+j+'floorHeight'+floorHeight);
      $("#floorUl").css('top', '-' + 35 * j + 'px');
    }
    ;
    // alert('floorUp'+j);
    //----------------------------------------
    for (var v = 0; v < floor.length; v++) {

      var floorLiTop = $('#' + floor[v].floorId).offset().top - floorOutTop;
      if (floorLiTop > 0 && floorLiTop <= 35) {

        $('#' + floor[v].floorId).css({'color': 'red', 'font-size': '24px'});
        //alert(floor[v].floorId);
        loadMap(mapUrl, floor[v].floorUrl);

        OlFloorId = floor[v].floorId;
        OlFloorNum = floor[v].floorNum;

        floorName = floor[v].floorName;

        BeefindMap.prototype.floor = floorName;
        BeefindMap.prototype.floorId = OlFloorId;

        beefindCar(url, OlBuildId, floor[v].floorId,olMapType);
        beefindDevice(dataurl, OlBuildId, floor[v].floorId);
      } else {

        $('#' + floor[v].floorId).css({'color': 'black', 'font-size': '18px'});
      }
      ;//

    };
    //console.log(floorName);
    return callback(floorName,OlFloorId);
    //:
  };//upFloor
  //添加车位层函数
  /*
  * screenPoint参数（y引导屏幕坐标）;
  * screenType（引导屏幕的类型）
  * */
  var addScreen = function (val) {
      screenLayer.getSource().clear();
      if(val!=null&&val.screen_x!=undefined&&val.screen_y!=undefined){
        let screenFeature= new ol.Feature({});
            screenFeature.floor_id=val.floor_id;
          screenFeature.setGeometry(new ol.geom.Point([val.screen_x,val.screen_y]));
        screenFeature.setStyle(screenStyle);
        screenLayer.getSource().addFeature(screenFeature);
        screenLayer.setVisible(true);
        //引导屏幕是否在同一层;显示?在:隐藏
        //val.floor_id ==OlFloorId ? screenLayer.setVisible(true) : screenLayer.setVisible(false);
      };

  };//
  /*
  * 点击VIP车位添加图标
  * addVipIcon
  * */
  var addVipIcon = function (val) {
    vipIconLayer.getSource().clear();
    if(val!=null&&val.carposPoint!=undefined){
      let vipIconFeature= new ol.Feature({});
      vipIconFeature.floor_id=val.floor_id;
      vipIconFeature.setGeometry(new ol.geom.Point([val.carposPoint[0],val.carposPoint[1]]));
      vipIconFeature.setStyle(vipCarStyle);
      vipIconLayer.getSource().addFeature(vipIconFeature);
      vipIconLayer.setVisible(true);
      //引导屏幕是否在同一层;显示?在:隐藏
      //val.floor_id ==OlFloorId ? screenLayer.setVisible(true) : screenLayer.setVisible(false);
    };

  };//
  /*
  * screenCar(引导屏幕控制的车位);
  *
  * */
  var findCarFeature = function (feature) {//传递一个要素，找到对应的车位要素;

    let carFuter = carLayer.getSource().getFeatures();

      function findFeature(carFuter){
          return carFuter.carUID==feature.carUID;
      };//

      var carFeature=carFuter.filter(findFeature);
          carFeature=carFeature[0];

      return  carFeature;
  };//
  //
  var resetCarColor=function (color) {
    let carFuter = carLayer.getSource().getFeatures();
        carFuter.forEach(function (val,index,arr) {
            val.setCarColor(color);
        });
    //carLayer.getSource().getFeatures();
  };//
  var resetFeatureCarColor=function (color,featrue) {
    let carFuter = carLayer.getSource().getFeatures();
    let featrueNow = featrue;
    carFuter.forEach(function (val,index,arr) {
      if(featrueNow.carUID==val.carUID) {
        val.setCarColor(color);
      }

    });
    //carLayer.getSource().getFeatures();
  };//
  var setVipCarColor=function (date,color) { // vIP 车位管理专用

    let carFuter = carLayer.getSource().getFeatures();
    carFuter.forEach(function (val,index,arr) {
      val.VipCar=false;
      val.car_numbers=[];
    });
    date.forEach(function (valT,indexT,arrT) {
      carFuter.forEach(function (val,index,arr) {
        if(val.carUID==valT.carpos_gid){
          val.VipCar=true;
          val.car_numbers=valT.car_numbers;
          val.setCarColor(color);
        };
      });

    })

    //carLayer.getSource().getFeatures();
  };//
  //
  var screenCarColor = function (screenCar,color) {
    //对于所有车位要素设置车位色;
    let carFuter = carLayer.getSource().getFeatures();
    let carEventFeature = carLayerEventPoint.getSource().getFeatures();

    //console.log(carEventFeature);
    if(carEventFeature.length>=1){
      carEventFeature.forEach(function (val,index,arr) {
        val.choseCar=false;
      });//
    };
    //
    let carGid;
        //console.log(carFuter);
        //数组的filter过滤函数;
        function checkScreenCar(carFuter){
           return carFuter.carUID==carGid;
        };//
        function checkScreenEventCar(carEventFeature){
           return carEventFeature.carUID==carGid;
        };//
        //
        let message = screenCar.message;
        let indexT = screenCar.index;
        let carColor = screenCar.carColor;
        //
        carFuter.forEach(function (val) {
         val.setCarColor('#969696');
         val.choseCar=false;
         val.index=indexT;
         val.message=message;
         val.carColor=carColor;
        });
        screenCar.carpos_list.forEach(function (item,index,arr) {
          carGid=item.carpos_gid;

          var screenCar=carFuter.filter(checkScreenCar);//
              //console.log(screenCar);
              screenCar[0].index=indexT;
              screenCar[0].message=message;
              screenCar[0].carColor=carColor;
              screenCar[0].choseCar=true;//当前是否被选
              screenCar[0].setCarColor(color);
          var screenEventCar = carEventFeature.filter(checkScreenEventCar);
              //console.log(screenEventCar);
              if(screenEventCar.length>=1){
                screenEventCar[0].index=indexT;
                screenEventCar[0].message=message;
                screenEventCar[0].carColor=carColor;
                screenEventCar[0].choseCar=true;//当前是否被选
              };

        },this.val);




  };//screenCarColor

  //刷新车位利用率
  var refreshUseCar=function () {
    //var url = 'http://139.196.5.153:8080';
    //console.log(OlFloorId);
    // console.log('url='+url+';OlBuild'+olBuildId+';OlFloorId='+OlFloorId +';olMapType='+olMapType);
     beefindCar(url, OlBuildId, OlFloorId ,olMapType);
  };//




//:
  down.addEventListener('click', function () {
    downFloor(floorSuccess);
  });//floorUp
  up.addEventListener('click', function () {
    upFloor(floorSuccess);
  });//floorUp
//:

  var floorSuccess = function () {
    console.log(777);
  };//
//style:车位样式;


  var style_0 = new ol.style.Style({
    fill: new ol.style.Fill({
      color: '#83CC1B'
    }),
    stroke: new ol.style.Stroke({
      width: 1,
      color: 'white'
    })
  });
//:車位樣式
  var carText = new ol.style.Style({
    text: new ol.style.Text({
      font: '14px sans-serif',
      //add carText;
      text: 1,
      textAlign: 'center',
      fill: new ol.style.Fill({
        color: 'black'
      })
    })
  });
//:drawCar()绘制车位
  var screenStyle = new ol.style.Style({
    image: new ol.style.Icon({
      src: "../../../static/img/screen.png",
      scale: 0.55
    })
  });
  // 点击VIP车位后添加的图标
  var vipCarStyle = new ol.style.Style({
    image: new ol.style.Icon({
      src: "../../../static/img/floor/u.png",
      scale: 0.55
    })
  });
//:
//:
  var point = function (x, y) {
    return (new ol.geom.Point([x, y]));
  };
//:
  var interPointVector = function (interData) {
    //判断数据源(有:清除;无:;)
    if (interPointLayer.getSource() != null && interPointLayer.getSource() != "" && interPointLayer.getSource() != undefined) {
      interPointLayer.getSource().clear();
    }
    ;
    for (var d = 0; d < interData.length; d++) {
      InterLayer.prototype = new ol.Feature({});
      var pointInter = new InterLayer(interData[d]);
      //console.log(pointInter);
      pointInter.setGeometry(new ol.geom.Point(pointInter.coordinates));
      pointInter.setInterImg(pointInter.inpointType);

      sourceInterPoint.addFeature(pointInter);
    }
    ;//for(var d=0;d<interPoint.length;d++)
    //------------------------------------------------
    interPointLayer.setSource(sourceInterPoint);

  };//interPointVector
//:绘制车位函数
  /*
    carDate:车位信息
    carMapDate:地图状态数据
    carCountDate:车位数量数据
    type:绘制的地图类型
  */
  //绘制车位状态图
  var carStateColor=function (buildId,floorId,carDate,carMapDate,q) {
    for (var r = 0; r < carMapDate.carpos_Info.length; r++) {

      //
      if (carMapDate.carpos_Info[r].carpos_gid == carDate[q].carUID) {
        //console.log(r);

        Car.prototype = new ol.Feature({});
        CarPort.prototype = new ol.Feature({});
        //CarEventPort.prototype = new ol.Feature({});
        //var eventFeature=new ol.Feature({});
        var car = new Car(buildId, floorId, carDate[q], carMapDate.carpos_Info[r],'');
        //--
        car.setGeometry(new ol.geom.Polygon([car.coordinates]));
        //更具不同状态绘制车位颜色
        if (car.car_state == 0) {
          //-------------------------------------
          car.setCarColor("#83CC1B", car.carNum, 'center', 'black');
        } else if (car.car_state == 1) {
          car.setCarColor("#FF0000", car.carNum, 'center', 'black');
        } else if (car.car_state == 2) {
          car.setCarColor("#FFCF51", car.carNum, 'center', 'black');
        } else if (car.car_state == 3) {
          car.setCarColor("#130A10", car.carNum, 'center', 'black');
        } else if (car.car_state == 4) {
          car.setCarColor("#7698FF", car.carNum, 'center', 'black');
        } else if (car.car_state == 5) {
          car.setCarColor("#FFB766", car.carNum, 'center', 'black');
        } else {
          car.setCarColor("#FF0000", car.carNum, 'center', 'black');
        }
        ;
        //
        var portCar = new CarPort();
        portCar.setGeometry(new ol.geom.Point(car.carposPoint));
        portCar.setPortColor(car.carNum, 'center', 'black');
        //:
        /*if (car.carNum % 2 == 0) {
          // console.log(car.carNum);
          var portEventCar = new CarEventPort();
          portEventCar.setGeometry(new ol.geom.Point(car.carposPoint));
          portEventCar.setPortColor(car.carNum, 'center', 'black');
          sourceEventCarPoint.addFeature(portEventCar);
        };//*/
        //:添加要素
        sourceCar.addFeature(car);
        sourceCarPoint.addFeature(portCar);
      };//if()
      //

   }//for

  };//
  //---------
  //绘制车位利用率图
  var carUseColor=function (buildId,floorId,carDate,carUseDate,q) {
    //console.log(carUseDate);

    //console.log(carDate[q].carUID);
    for (var r = 0; r <carUseDate.length; r++) {
       //console.log(carDate[q].carUID);
       //console.log(carUseDate[r].carpos_gid);
       //console.log(carUseDate[r].carpos_gid == carDate[q].carUID);
      //
     if (carUseDate[r].carpos_gid == carDate[q].carUID) {

        //console.log(r);

        Car.prototype = new ol.Feature({});
       CarPort.prototype = new ol.Feature({});
       CarEventPort.prototype = new ol.Feature({});
        //var eventFeature=new ol.Feature({});
        //
        var car = new Car(buildId, floorId, carDate[q],'',carUseDate[r]);
        //--
            car.setGeometry(new ol.geom.Polygon([car.coordinates]));
        //更具不同状态绘制车位颜色
        if (car.carRatio>=0&&car.carRatio<=19) {
          //-------------------------------------
          car.setCarColor("#83CC1B", car.carNum, 'center', 'black');
        } else if (car.carRatio>=20&&car.carRatio<=39) {
          car.setCarColor("#FF0000", car.carNum, 'center', 'black');
        } else if (car.carRatio>=40&&car.carRatio<=59) {
          car.setCarColor("#FFCF51", car.carNum, 'center', 'black');
        } else if (car.carRatio>=60&&car.carRatio<=80) {
          car.setCarColor("#130A10", car.carNum, 'center', 'black');
        } else {
          car.setCarColor("#FF0000", car.carNum, 'center', 'black');
        };
        //
        var portCar = new CarPort();
        portCar.setGeometry(new ol.geom.Point(car.carposPoint));
        portCar.setPortColor(car.carNum, 'center', 'black');
        //:
       var portEventCar;
       //carNum.replace(/[^0-9]/ig,'')
        if (car.carNum.replace(/[^0-9]/ig,'') % 2 == 0) {
          // console.log(car.carNum);
          portEventCar = new CarEventPort();
          portEventCar.setGeometry(new ol.geom.Point(car.carposPoint));
          portEventCar.setPortColor(car.carNum, 'center', 'black');
          sourceEventCarPoint.addFeature(portEventCar);
        };//
        //:添加要素
        sourceCar.addFeature(car);
        sourceCarPoint.addFeature(portCar);
      };//if()

    };//for()
    //
  };//


  //
  var drawCar = function (buildId, floorId, carDate, carMapDate, carCountDate,carUseDate,type) {


    //创建车位对象，并且添加相关属性
    for (var q = 0; q < carDate.length; q++) {
      //每个车为都是一个对象
        //console.log(q);
        //console.log(type);
        if(type=="carState"){
           carStateColor(buildId,floorId,carDate,carMapDate,q);//车位状态图
         }else{
           carUseColor(buildId,floorId,carDate,carUseDate,q);
         };
        //----------------

      //
      //------------------------------------------------------
    };//for();
    carLayer.setSource(sourceCar);
    carLayerPoint.setSource(sourceCarPoint);
    //carLayerEventPoint.setSource(sourceEventCarPoint);
  };//drawCar
  //:
  /*
   carDate:车位基本参数
   carMapDate:车位状态参数
   */
  var addCarState=function (carDate,carMapDate,carFeature,eventCarFeature) {

    //console.log(carMapDate);

    //console.log(carMapDate.carpos_Info.length);
    //console.log(carFeature);
    //console.log(eventCarFeature);
    for(var e=0;e<carMapDate.carpos_Info.length;e++){
      //console.log(carMapDate.carpos_Info);

      if(carMapDate.carpos_Info[e].carpos_gid==carFeature.carUID){
        //console.log(e);
        //console.log(carMapDate.carpos_Info[e].car_state);
        //给车位对象添加状态属性

        carFeature.car_state=carMapDate.carpos_Info[e].car_state;
        carFeature.car_number=carMapDate.carpos_Info[e].car_number;
        carFeature.car_enterTime=carMapDate.carpos_Info[e].car_enterTime;
        carFeature.car_picUrl=carMapDate.carpos_Info[e].car_picUrl;
        carFeature.car_videoUrl=carMapDate.carpos_Info[e].car_videoUrl;
        //
        if(eventCarFeature){
          eventCarFeature.car_state=carMapDate.carpos_Info[e].car_state;
          eventCarFeature.car_number=carMapDate.carpos_Info[e].car_number;
          eventCarFeature.car_enterTime=carMapDate.carpos_Info[e].car_enterTime;
          eventCarFeature.car_picUrl=carMapDate.carpos_Info[e].car_picUrl;
          eventCarFeature.car_videoUrl=carMapDate.carpos_Info[e].car_videoUrl;
        };


        //------------------
        //console.log(carFeature);
        //console.log(carFeature.car_state);

        if (carFeature.car_state == '0') {
          //-------------------------------------
          carFeature.setCarColor("#85e249", carFeature.carNum, 'center', 'black');
        } else if (carFeature.car_state == '1') {
          carFeature.setCarColor("#fd435a", carFeature.carNum, 'center', 'black');
        } else if (carFeature.car_state == '2') {
          carFeature.setCarColor("#ffbb44", carFeature.carNum, 'center', 'black');
        } else if (carFeature.car_state == '3') {
          carFeature.setCarColor("#000000", carFeature.carNum, 'center', 'black');
        } else if (carFeature.car_state == '4') {

          carFeature.setCarColor("#4882ff", carFeature.carNum, 'center', 'black');

        } else if (carFeature.car_state == '5') {
          carFeature.setCarColor("#d1980d", carFeature.carNum, 'center', 'black');
        } else {
          carFeature.setCarColor("#cccccc", carFeature.carNum, 'center', 'black');
        };

        break;

      };
    };//

    //console.log(carRule);
    //BeefindMap.prototype.carRule=carRule;

  };//
  //---------
  /*
   carDate:车位基本参数
   carMapDate:车位状态参数
   */
  //carLayer.getSource.getFeatures;//
  var changeCarState =function(carDate,carMapDate,carFeature,eventCarFeature){
    for(let t=0;t<eventCarFeature.length;t++){
      for(let f=0;f<carMapDate.carpos_Info.length;f++){
        if(carMapDate.carpos_Info[f].carpos_gid==eventCarFeature[t].carUID){
          eventCarFeature[t].car_state=carMapDate.carpos_Info[f].car_state;
          eventCarFeature[t].car_number=carMapDate.carpos_Info[f].car_number;
          eventCarFeature[t].car_enterTime=carMapDate.carpos_Info[f].car_enterTime;
          eventCarFeature[t].car_picUrl=carMapDate.carpos_Info[f].car_picUrl;
          eventCarFeature[t].car_videoUrl=carMapDate.carpos_Info[f].car_videoUrl;
        };
      }

    };//
    //
    for(let r=0;r<carFeature.length;r++){
      //

      //
      for(let f=0;f<carMapDate.carpos_Info.length;f++){
        if(carMapDate.carpos_Info[f].carpos_gid==carFeature[r].carUID){
          //给车位对象添加状态属性
          carFeature[r].car_state=carMapDate.carpos_Info[f].car_state;
          carFeature[r].car_number=carMapDate.carpos_Info[f].car_number;
          carFeature[r].car_enterTime=carMapDate.carpos_Info[f].car_enterTime;
          carFeature[r].car_picUrl=carMapDate.carpos_Info[f].car_picUrl;
          carFeature[r].car_videoUrl=carMapDate.carpos_Info[f].car_videoUrl;




          //------------------
          //console.log(carFeature);
          //console.log(carFeature.car_state);

          if (carFeature[r].car_state == '0') {
            //-------------------------------------
            carFeature[r].setCarColor("#85e249", carFeature[r].carNum, 'center', 'black');
          } else if (carFeature[r].car_state == '1') {
            carFeature[r].setCarColor("#fd435a", carFeature[r].carNum, 'center', 'black');
          } else if (carFeature[r].car_state == '2') {
            carFeature[r].setCarColor("#ffbb44", carFeature[r].carNum, 'center', 'black');
          } else if (carFeature[r].car_state == '3') {
            carFeature[r].setCarColor("#000000", carFeature[r].carNum, 'center', 'black');
          } else if (carFeature[r].car_state == '4') {

            carFeature[r].setCarColor("#4882ff", carFeature[r].carNum, 'center', 'black');

          } else if (carFeature[r].car_state == '5') {
            carFeature[r].setCarColor("#d1980d", carFeature[r].carNum, 'center', 'black');
          } else {
            carFeature[r].setCarColor("#cccccc", carFeature[r].carNum, 'center', 'black');
          };

          break;

        };
      };//
    };


  };//

  //------
  var addCarUse=function (carDate,carUseDate,carFeature) {

    for(var e=0;e<carUseDate.length;e++){
      //
      if(carUseDate[e].carpos_gid==carFeature.carUID){
        //给车位对象添加状态属性
        carFeature.carpos_ratio=carUseDate[e].carpos_ratio*100;

        if (carFeature.carpos_ratio>=0&&carFeature.carpos_ratio<=20) {
          //-------------------------------------
          carFeature.setCarColor("#9ade31", carFeature.carNum, 'center', 'black');
        } else if (carFeature.carpos_ratio>=21&&carFeature.carpos_ratio<=40) {
          carFeature.setCarColor("#fbdc44", carFeature.carNum, 'center', 'black');
        } else if (carFeature.carpos_ratio>=41&&carFeature.carpos_ratio<=60) {
          carFeature.setCarColor("#f8aa2e", carFeature.carNum, 'center', 'black');
        } else if (carFeature.carpos_ratio>=61&&carFeature.carpos_ratio<=80) {
          carFeature.setCarColor("#ff8350", carFeature.carNum, 'center', 'black');
        } else {
          carFeature.setCarColor("#fd435a", carFeature.carNum, 'center', 'black');
        };
      };
    };//
  };//
  /**/
  var basicDrawCar=function (buildId, floorId, carDate, carMapDate,carUseDate,type) {

    for (var q = 0; q < carDate.length; q++) {
      //每个车为都是一个对象
      //console.log(q);

      BasicCar.prototype = new ol.Feature({});
      CarPort.prototype = new ol.Feature({});
      CarEventPort.prototype = new ol.Feature({});
      //---------------
      var car = new BasicCar(buildId, floorId, carDate[q]);
          car.setGeometry(new ol.geom.Polygon([car.coordinates]));

      //--------------------------------------------------

      var portEventCar;
      //偶数车位
      //car.carNum = car.carNum.replace(/[^0-9]/ig,'');
      if (car.carNum.replace(/[^0-9]/ig,'') % 2 == 0) {
        //console.log(carDate[q]);
        portEventCar = new CarEventPort(carDate[q]);
        portEventCar.setGeometry(new ol.geom.Point(car.carposPoint));
        portEventCar.setPortColor(car.carNum, 'center', 'black');
        sourceEventCarPoint.addFeature(portEventCar);
      };//
      //根据类型绘制不通的底图;
      if(type=='carState'){
        car.setCarColor("#cccccc", car.carNum, 'center', 'black');

        //addCarState(carDate,carMapDate,car,portEventCar);

      }else if(type=='useState') {

        car.setCarColor("#9ade31", car.carNum, 'center', 'black');
        addCarUse(carDate,carUseDate,car);
      }else if(type=='screenControl'){
        car.setCarColor("#969696", car.carNum, 'center', 'black');
      }else{
        car.setCarColor("#9ade31", car.carNum, 'center', 'black');
      };//
      //:

      //:添加要素
      sourceCar.addFeature(car);
     // sourceCarPoint.addFeature(portCar);
      //------------------------------------------------------
    };//for();
    carLayer.setSource(sourceCar);
    //carLayerPoint.setSource(sourceCarPoint);
    carLayerEventPoint.setSource(sourceEventCarPoint);
  };//
  /*
  carDate:车位基本参数
  carMapDate:车位状态参数
  */

//:------和获取设备视频的url----------------------------
  var getVideoUrl = function (url, device_id, device_area, floorid) {
    var videoUrlDate;
    $.ajax({
      cache: false,
      type: 'POST',
      async: false,
      dataType: 'json',
      url: url + '/listmac',
      //url:"http://192.168.3.36:8080/mapserve/carposinpoint?",
      data: {
        device_id: device_id,
        device_area: device_area,
        device_floorID: floorid
      },
      success: function (result) {
        //console.log(result);

          videoUrlDate = result;
          //获取引导屏幕参数(函数)
          //---------------------------


      },
      error: function (xhr, status, error) {
        if (xhr.statusText == "timeout") {
          //img.innerHTML="请求超时!";
          console.log('请求超时!');
        } else {
          //img.innerHTML="服务器出错!";
          console.log('服务器出错!');
        }
        ;
      }
    });//$.ajax

    return videoUrlDate;
  };//
//--------------------------------
//:------和获取已知设备的，有视频的日期----------------------------
  var getCameraDate = function (url, buildId, device_area, device_id) {
    var cameraDate;
    $.ajax({
      cache: false,
      type: 'POST',
      async: false,
      dataType: 'json',
      timeout: 2000,
      url: url + '/getVideoDate',
      //url:"http://192.168.3.36:8080/mapserve/carposinpoint?",
      data: {
        build_id: buildId,
        area_id: device_area,
        dev_id: device_id
      },
      success: function (result) {
        //console.log(result);
        //if(result.result==0){
        //alert('获取视频失败!');
        //}else{

        cameraDate = result;
        //获取引导屏幕参数(函数)
        //---------------------------
        //};
        //return cameraDate;

      },
      error: function (xhr, status, error) {
        var result = {
          result: 0
        };
        if (xhr.statusText == "timeout") {
          //img.innerHTML="请求超时!";
          cameraDate = result;
        } else {
          //img.innerHTML="服务器出错!";
          cameraDate = result;
          //alert('服务器出错!!!!!');
        }
        ;
      }
    });//$.ajax

    return cameraDate;
  };//
//------------------------------------
  var clearStateInter=function () {
    //console.log('clearInterval');
    clearInterval(carStateInter);
  };//
//:(车位数量)状态数据查询
  var carState = function (url, user_id, buildId, floorId) {
    var date;
    $.ajax({
      cache: false,
      type: 'POST',
      async: false,
      dataType: 'json',
      url: url + '/GOSSystem/getCarposSumInfo',
      //url:"http://192.168.3.36:8080/mapserve/carposinpoint?",
      data: {
        user_id: user_id,
        floor_id: floorId,
        build_id: buildId
      },
      timesout:3500,
      success: function (result) {
        //console.log(result);
        if (result.result == 0) {
          console.log('返回数据失败!');
        } else {
          date = result;

          //获取引导屏幕参数(函数)
          //---------------------------
        };

      },
      error: function (xhr, status, error) {
        if (xhr.statusText == "timeout") {
          //img.innerHTML="请求超时!";
          console.log('请求超时!');
        } else {
          //img.innerHTML="服务器出错!";
          console.log('服务器出错!');
        }
        ;
      }
    });//$.ajax

    return date;
  };//
//:获取车位状态(地图)图数据
  var carMapState = function (url, user_id, buildId, floorId) {
    var carMapDate;
    $.ajax({
      cache: false,
      type: 'POST',
      async: false,
      dataType: 'json',
      url: url + '/GOSSystem/getCarposMapInfo',
      //url:"http://192.168.3.36:8080/mapserve/carposinpoint?",
      data: {
        user_id: user_id,
        floor_id: floorId,
        build_id: buildId
      },
      success: function (result) {
        //console.log(result);
        if (result.result == 0) {
          console.log('返回数据失败!');
        } else {

          carMapDate = result;
          //获取引导屏幕参数(函数)
          //---------------------------
        };

      },
      error: function (xhr, status, error) {
        if (xhr.statusText == "timeout") {
          //img.innerHTML="请求超时!";
          console.log('请求超时!');
        } else {
          //img.innerHTML="服务器出错!";
          console.log('服务器出错!');
        };
      }
    });//$.ajax

    return carMapDate;
  };//
//:获取车位利用率数据
  var carUseState = function (url, user_id, buildId, floorId, time) {
    var postTime=time;

    var carUseDate;
    $.ajax({
      cache: false,
      type: 'POST',
      async: false,
      dataType: 'json',
      url: url + '/GOSSystem/getEachCarposRatio',
      //url:"http://192.168.3.36:8080/mapserve/carposinpoint?",
      data: {
        user_id: user_id,
        floor_id: floorId,
        build_id: buildId,
        start_time:postTime.start_time,
        end_time:postTime.end_time
      },
      success: function (result) {
          //console.log(result);
          carUseDate = result;
          //获取引导屏幕参数(函数)
          //---------------------------

      },
      error: function (xhr, status, error) {
        if (xhr.statusText == "timeout") {
          //img.innerHTML="请求超时!";
          alert('请求超时!');
        } else {
          //img.innerHTML="服务器出错!";
          alert('服务器出错!');
        }
        ;
      }
    });//$.ajax

    return carUseDate;
  };//
//:获取车位数据
//
  var beefindCar = function (dataurl, buildId, floorId, mapType) {
    var carFeature,carEventFeature;
    //var carStateInter;
    $.ajax({
      cache: false,
      type: 'POST',
      async: false,
      dataType: 'json',
      url: dataurl + '/mapserve/carposinpoint?',
      data: {
        floorID: floorId,
        buildingID: buildId
      },
      success: function (result) {

        console.log(result);
        if (result.result == 0) {
          alert('返回数据失败!');
        } else {
          var messageone = result.response_carpos;
          var interPoint = result.response_inpoint;
          //-------------------
          //地图车位的底图
          if(mapType=='carState'){//车位状态图
            //----------------------
            //function carInter() {
              carMapDate = carMapState(localUrl, 'beefind001', buildId, OlFloorId);//地图数量
              carStateDate=carState(localUrl,'beefind001',buildId,OlFloorId);//车位数量数据


              BeefindMap.prototype.carpos_sum=carStateDate.carpos_sum;
              carUseDate=[];
           // };//


            //setTimeout(function () {

              carStateInter=setInterval(function () {
                //console.log(OlFloorId);
                //console.log(mapType);
                carMapDate = carMapState(localUrl, 'beefind001', buildId, OlFloorId);//车位状态数据
                carStateDate=carState(localUrl,'beefind001',buildId,OlFloorId);//车位数量数据
                console.log(carMapDate);
                console.log(carStateDate);
                //
                BeefindMap.prototype.carpos_sum=carStateDate.carpos_sum;
                carUseDate=[];
                //
                //console.log(carFeature);
                //console.log(carEventFeature);
                changeCarState(messageone,carMapDate,carFeature,carEventFeature);
              },1000*60*2);//2分钟刷新一次

            //},4000);



          }else if(mapType=='useState'){//车位利用率
            clearInterval(carStateInter);
            //
            //车位利用率
            carUseDate=carUseState(localUrl,'beefind001',buildId,floorId,timeDate);//车位利用率数据
            //console.log(carUseDate);
            if(carUseDate.result==1){
              carUseDate=carUseDate.eachCarpos_list;
              //console.log(carUseDate);
            };
            carMapDate=[];
            carStateDate=[];
          }else if(mapType=='screenControl'){//引导屏幕
            clearInterval(carStateInter);

            //console.log('clearInterval');
            carMapDate=[];
            carStateDate=[];
          }else{
            clearInterval(carStateInter);
            carMapDate=[];
            carStateDate=[];
          };
          //-----------------------

          if (messageone != "" && messageone != undefined && messageone != null) {
            sourceCar = new ol.source.Vector();
            sourceCarPoint = new ol.source.Vector();
            sourceEventCarPoint = new ol.source.Vector();
            //绘制基本地图并添加地图车位状态;

            basicDrawCar(buildId,floorId,messageone,carMapDate,carUseDate,mapType);

            if(mapType=='carState'){
              carFeature=carLayer.getSource().getFeatures();
              carEventFeature=carLayerEventPoint.getSource().getFeatures();
              changeCarState(messageone,carMapDate,carFeature,carEventFeature);
            };//

            //drawCar(buildId, floorId, messageone, carMapDate, carStateDate,carUseDate,mapType);
          };//
          //获取引导屏幕参数(函数)
          //------------------------
          if (interPoint != "" && interPoint != undefined && interPoint != null) {
            sourceInterPoint = new ol.source.Vector();
            interPointVector(interPoint);
          }
          ;//
          //---------------------------
        }
        ;

      },
      error: function (xhr, status, error) {
        if (xhr.statusText == "timeout") {
          //img.innerHTML="请求超时!";
          alert('请求超时!');
        } else {
          //img.innerHTML="服务器出错!";
          alert('服务器出错!');
        }
        ;
      }
    });//$.ajax
  };//beefindCar

//:
  var crearteFloor = function (buildId, floorId, floorName, floorMapUrl, index) {
    var floorLi = document.createElement('li');

    floorLi.setAttribute('id', floorId);
    floorLi.setAttribute('name', index);
    console.log(floorName);
    floorLi.innerText = floorName;
    floorLi.innerHTML = floorName;
    floorUl.appendChild(floorLi);

    //alert(floorLi.offsetTop);
    floorLi.style.width='35px';
    floorLi.style.height='35px';
    // floorLi.style.border='1px solid #00ff00';
    floorLi.style.overflow='hidden';

    if (floorLi.offsetTop >= 0 && floorLi.offsetTop < 35) {
      floorLi.style.color = 'red';
      floorLi.style.fontSize = '24px';

    } else {
      floorLi.style.color = 'black';
      floorLi.style.fontSize = '18px';
    }
    ;//
    // console.log(8888);
  };//crearteFloor
//:加载Map
  var loadMap = function (mapUrl, floorMapUrl) {
    //var configFloorUrl=floorMapUrl.substr(0,14)+'_SET';
    var configFloorUrl = floorMapUrl.substr(0, 14) + '_MAP';
    //console.log(configFloorUrl);
    var source = new ol.source.TileWMS({
      url: mapUrl,
      //F0021B0002LX4
      params: {'layers': configFloorUrl},
      serverType: 'geoserver'
    });//
    layer.setSource(source);
    //-------------------------------

  };//loadMap
//:加载楼层信息
  var mapserveFloor = function (url, cityId, buildId, floorId, mapUrl, mapType) {
    floor = [];
    $.ajax({
      cache: false,
      type: 'POST',
      async: false,
      dataType: 'json',
      url: '' + url + '/mapserve/floor?',
      data: {
        cityID: cityId,
        buildingID: buildId
      },
      timeout: 3500,
      success: function (result) {
        if (result.result == 0) {
          alert('请求数据失败!');
        } else {
          //-------------------------------
          OlWidth=result.olmapWidth;
          OlHeight=result.olmapHeight;
          var olZoom;
          var olMapCenter;
          if (OlHeight == 91548) {
            olZoom = (91548 / OlHeight) * 9.55;
          } else {
            olZoom = (91548 / OlHeight) * 9.55 * 0.23;
          };
          // if(listCity[a].Build[b].olMapHeight==91548)
          olMapCenter = [parseFloat(OlWidth / 2), -parseFloat(OlHeight / 2)];
          //console.log(olMapCenter);
          map.getView().setCenter(olMapCenter);

          map.getView().setZoom(olZoom);
          //--------------------------------
          if(floorId==""||floorId==null||floorId==undefined){
            //默认首层



            OlFloorNum = result.response[0].floorNum;
            OlFloorId = result.response[0].floorID;
            floorId=OlFloorId;
  console.log('OlBuildId='+OlBuildId+'OlFloorId='+OlFloorId+'OlFloorNum='+OlFloorNum);
            beefindCar(url, buildId, OlFloorId, mapType);

            //设备
            beefindDevice(url, buildId, OlFloorId);

          }else{

            console.log('初始OlBuildId='+OlBuildId+'OlFloorId='+OlFloorId+'OlFloorNum='+OlFloorNum);
            console.log('floorId==>'+floorId);
            beefindCar(url, buildId, floorId, mapType);
            //设备
            beefindDevice(url, buildId, floorId);
          };//
          console.log(floorId)
          //-----------------------------------------
          for (var z = 0; z < result.response.length; z++) {
            floor[z] = new Object();
            floor[z].floorId = result.response[z].floorID;
            floor[z].floorName = result.response[z].floorName;
            floor[z].floorNum = result.response[z].floorNum;
            floor[z].floorUrl = result.response[z].floorUrl;
            floor[z].index = z;
            //createFloorTab();
            if (result.response[z].floorID == floorId) {
              var floorMapUrl = result.response[z].floorUrl;

              loadMap(mapUrl, floorMapUrl);

              floorName = result.response[z].floorName;
              BeefindMap.prototype.floor = floorName;
              BeefindMap.prototype.floorId = floorId;

              OlFloorIdIndex = floor[z].index;
              $("#floorUl").css('top', '-35' * z + 'px');
              j = z;
            }
            ;//
            console.log('crearteFloor');
            crearteFloor(buildId, result.response[z].floorID, result.response[z].floorName, result.response[z].floorUrl, z);
          };//for(var z);

        }
        ;//(result.result==0)

      },//success
      error: function (xhr, status, error) {
        if (xhr.statusText == "timeout") {
          //img.innerHTML="请求超时!";
          alert('请求超时!');
        } else {
          //img.innerHTML="服务器出错!";
          alert('服务器出错!');
        }
        ;
      }
    });//$.ajax

  };//mapserveFloor
//-----------------------------

  var layer = new ol.layer.Tile({});
  /*var source=new ol.source.TileWMS({
      url:mapUrl,
      //F0021B0002LX4
      params:{'layers':configFloorUrl},
      serverType:'geoserver'
  });//*/
//layer.setSource(source);
//
  var carLayer = new ol.layer.Vector({});
  var sourceCar;
  var sourceCarPoint;
  var sourceEventCarPoint;
  var carLayerPoint = new ol.layer.Vector({
    //visible:false
  });
  var carLayerEventPoint = new ol.layer.Vector({
    //visible:false
  });
// var  deviceSource=new ol.source.Vector();
  var interPointLayer = new ol.layer.Vector({
    // source:new ol.source.Vector()
  });
  //var screenLayer = new ol.layer.Vector({});
//
  var deviceLayer = new ol.layer.Vector({
    // source:new ol.source.Vector()
  });
  //屏幕层
  var screenLayer = new ol.layer.Vector({
      source: new ol.source.Vector()
  });
  //Vip车位图标层
  var vipIconLayer = new ol.layer.Vector({
    source: new ol.source.Vector()
  });

//var sourceScreen=new ol.source.Vector({});

  var addPointLayer = new ol.layer.Vector({});
  var interactions = ol.interaction.defaults({
    altShiftDragRotate: false,
    pinchRotate: false
  });
  //
  //console.log(OlWidth);

//
  var map = new ol.Map({
    layers: [layer, carLayer, carLayerPoint, carLayerEventPoint, interPointLayer, deviceLayer, screenLayer, vipIconLayer, addPointLayer],
    target: '',
    interactions: interactions,
    controls: ol.control.defaults({
      attributionOptions: ({
        collapsible: false
      })
    }),
    view: new ol.View({
      //center: ol.proj.transform([121.416118,31.218479],'EPSG:4326','EPSG:900913'),
      center: [80, -80],
      //ol.proj.transform(,EPSG:4326,EPSG:),
      projection: 'EPSG:3857',
      zoom: 10,
      maxZoom: 14,
      minZoom: 8.5,
      extent:[0,-OlHeight,OlWidth,0]
    }),
    logo: false,
    controls: ol.control.defaults({
      attribution: false,
      zoom: false
    })
  });
//var map=new ol.Map({});
//------------------------
//nextFloor(是下一層)
//beforeFloor(是上一層)
//floorBarVisible(樓層控件是否顯示)

  var BeefindMap = function (options) {
    //extend方法
    this.extend = function (obj, obj2) {
      for (var k in obj2) {
        obj[k] = obj2[k];
      }
      return obj;
    };
    this.options = this.extend({
      "target": 'map',
      "city_id": "F0021",//城市ID/
      "mapType":'',//地图类型(默认是车位状态图)
      "floorUl":'',
      'urlLocal':'',//全局的url(p2p)
      'timeDate':'',//初始化车位利用率时间端
      "build_id": "B0003",//項目ID
      "floor_id": "",//樓層Id
      "floor_num": "",//樓層名
      'url': "http://139.196.5.153:8080",//
      'floorBarVisible': false,//樓層控件是否顯示,
      "carLayerVisible": true,//:
      "carPortLayerVisible": true,//:
      "interLayerVisible": true,//:兴趣点层
      "deviceLayerVisible": false,//设备层
      'mapUrl': 'http://139.196.5.153:8181/geoserver/wms?'//地图服务器的url

    }, options);
    this.city_id = this.options.city_id;
    this.build_id = this.options.build_id;
    this.floor_id = this.options.floor_id;
    this.floorName = 'M';
    this.map = map;
    this.setTime=function (date){
       timeDate=date;
       //console.log(timeDate);
    };
    this.target = function (date) {
      this.map.setTarget(date);
    };
    //init方法;
    this.init = function () {
      var body = this.options.target;
      floorUl = this.options.floorUl;
      console.log(floorUl);
      timeDate=this.options.timeDate;
      //console.log(timeDate);
      //console.log(timeDate.end_time);
      OlBuildId=this.options.build_id;
      OlFloorId=this.options.floor_id;
      map.setTarget(this.options.target);
      olMapType=this.options.mapType;
      console.log('this.options.urlLocal==>'+this.options.urlLocal);
      if(this.options.urlLocal==undefined){
        localUrl='http://192.168.0.100:8421';
      }else {
        localUrl=this.options.urlLocal;
      };
      //
      console.log(this.options.floor_id);
      //
      //buildParam(this.options.url, this.options.city_id, this.options.build_id, this.options.floor_id, this.options.mapUrl,this.options.mapType);
      console.log('testUrl==>'+url);
      console.log('mapUrl==>'+this.options.mapUrl);
      console.log('localUrl==>'+localUrl);
      mapserveFloor(url, '', this.options.build_id, this.options.floor_id, this.options.mapUrl,this.options.mapType);
      //console.log(this.options.floorBarVisible);

      if (this.options.floorBarVisible) {
        $('#up').show();
        $('#down').show();
        $('#floor').show();
      } else {
        $('#up').hide();
        $('#down').hide();
        $('#floor').hide();
      }
      ;
      if (this.options.carLayerVisible) {
        carLayer.setVisible(true);
      } else {
        carLayer.setVisible(false);
      }
      ;
      if (this.options.carPortLayerVisible) {
        carLayerPoint.setVisible(true);
      } else {
        carLayerPoint.setVisible(false);
      }
      ;
      if (this.options.interLayerVisible) {
        interPointLayer.setVisible(true);
      } else {
        interPointLayer.setVisible(false);
      }
      ;
      if (this.options.deviceLayerVisible) {
        deviceLayer.setVisible(true);
      } else {
        deviceLayer.setVisible(false);
      }
      ;
      //alert("x是"+this.options.build_id+" y是"+this.options.floor_id+" z是"+this.options.floor_num);
    };
    this.nextFloor = function () {
      downFloor();
    };
    this.beforeFloor = function () {
      upFloor();
    };
    this.refreshUseCar=function () {
      refreshUseCar()
    };//
    //
    this.init();
    //this.nextFloor();
  };
  //BeefindMap()类
  //实现继承
  BeefindMap.prototype = map;//继承OL实例
  //:創建一個羅闊層
  //添加方法
  BeefindMap.constructor = BeefindMap;
  //BeefindMap.prototype.floorName='M';

  var CarLayer = function () {
    this.build = build;
  };//
  //:

  //暴漏方法:
  // window.BeefindMap = BeefindMap;
  //---------------------------
  //:
  /*var feature;
  map.on('singleclick',function (event) {
    console.log(event);
    feature = map.forEachFeatureAtPixel(event.pixel, function(feature){
      return feature;
    });
    if(feature) {
      console.log(feature);

    };//edit
  });//*/
//
  map.on('moveend', function () {
    var zoom = map.getView().getZoom();
    //alert(zoom);
    if (zoom > 9.7) {

      if (zoom > 11) {

        //console.log(carLayerPoint.getSource().getFeatures());

        carLayerPoint.setVisible(true);
        carLayerEventPoint.setVisible(false);
      } else {
        carLayerEventPoint.setVisible(true);
        carLayerPoint.setVisible(false);
      };

    } else {
      carLayerPoint.setVisible(false);
      carLayerEventPoint.setVisible(false);
    };

  });
//-----------------------
  return {
    BeefindMap: BeefindMap,
    floorSuccess: floorSuccess,
    getVideoUrl: getVideoUrl,
    getCameraDate: getCameraDate,
    upFloor: upFloor,
    downFloor: downFloor,
    refreshUseCar:refreshUseCar,
    clearStateInter:clearStateInter,
    addScreen:addScreen,//
    addVipIcon:addVipIcon, //点击VIP车位时候，添加图标
    screenCarColor:screenCarColor,//
    resetCarColor:resetCarColor,//重置颜色
    resetFeatureCarColor: resetFeatureCarColor, // 重置某个车位要素颜色
    setVipCarColor:setVipCarColor, // vip车位颜色设置
    findCarFeature:findCarFeature
  }


}());
//

//
//

export {
  module
}


