let initData=()=>{
    const group={         
      id:"",              //group unique id
      group:[],           //group account list
      status:1,           //group status [ 1:normal; 0:removed, 4:unknown ]
      create:0,           //group create time
      update:0,           //group update time
      notice:[],          //notice list, remove it?
      manager:"",         //group manager, only this one can destory the group
      founder:"",         //group init account
      announce:{          //group announce setting
          content:"",     //announce content
          expired:0,      //the announce expired time
      },
      permit:{            //permit setting
          free:true,      //free to join
          announce:false, //free to set announce
      }, 
      block:[],           //block list    
      nick:"",            //Group nickname

      last:{              //last message
        from:"",
        msg:""
      },            
      type:"group",       //talking type  
    };
    const contact={
      id:"",              //group unique id
      nick:"",            //nickname of contact
      update:0,           //group update time
      last:"",            //last message
      type:"contact"      //talking type
    }

    const gp_1=JSON.parse(JSON.stringify(group));
    gp_1.id="GDkCdYrCqRvX";
    gp_1.group=[
      "5mockRVETAEcF56UHhAUNNvcZEejjJvixN8v4mwJRCXDf788",
      "5mock2hKUJzIpuzFn7vQJPeLAEdUMZiwfFARFrHYzccGiIhx",
      "5mockapbQ9BQcGIuQ9NFjSSvYHxr6NQERc47kWMD4FeDwKeL"
    ];
    gp_1.founder="5mockRVETAEcF56UHhAUNNvcZEejjJvixN8v4mwJRCXDf788";
    gp_1.manager="5mockRVETAEcF56UHhAUNNvcZEejjJvixN8v4mwJRCXDf788";
    gp_1.update=1700615743020;
    gp_1.nick="Travelling happy days";
    gp_1.last={
      msg:"Enjoy the best days!",
      from:"5mockapbQ9BQcGIuQ9NFjSSvYHxr6NQERc47kWMD4FeDwKeL",
    }
    
    const gp_2=JSON.parse(JSON.stringify(group));
    gp_2.id="GDkCdYrCqRvX";
    gp_2.group=[
      "5mockRVETAEcF56UHhAUNNvcZEejjJvixN8v4mwJRCXDf788",
      "5mock2hKUJzIpuzFn7vQJPeLAEdUMZiwfFARFrHYzccGiIhx",
      "5mockapbQ9BQcGIuQ9NFjSSvYHxr6NQERc47kWMD4FeDwKeL",
      "6mockRVETAEcF56UHhAUNNvcZEejjJvixN8v4mwJRCXDf788",
      "6mock2hKUJzIpuzFn7vQJPeLAEdUMZiwfFARFrHYzccGiIhx",
      "6mockapbQ9BQcGIuQ9NFjSSvYHxr6NQERc47kWMD4FeDwKeL",
      "7ockRVETAEcF56UHhAUNNvcZEejjJvixN8v4mwJRCXDf788",
      "7mock2hKUJzIpuzFn7vQJPeLAEdUMZiwfFARFrHYzccGiIhx",
      "7mockapbQ9BQcGIuQ9NFjSSvYHxr6NQERc47kWMD4FeDwKeL",
    ];
    gp_2.founder="5mockRVETAEcF56UHhAUNNvcZEejjJvixN8v4mwJRCXDf788";
    gp_2.manager="5mockRVETAEcF56UHhAUNNvcZEejjJvixN8v4mwJRCXDf788";
    gp_2.update=1700399555483;
    gp_2.nick="W3OS波卡黑客松";
    gp_2.last={
      msg:"波卡2023冬季的黑客松",
      from:"7ockRVETAEcF56UHhAUNNvcZEejjJvixN8v4mwJRCXDf788",
    }

    const gp_3=JSON.parse(JSON.stringify(group));
    gp_3.id="GDkCdYrCqRvX";
    gp_3.group=[
      "5mockBaETAEcF56UHhAUNNvcZEejjJvixN8v4mwJRCXDf788",
      "5mock3DKUJzIpuzFn7vQJPeLAEdUMZiwfFARFrHYzccGiIhx",
      "5mock77bQ9BQcGIuQ9NFjSSvYHxr6NQERc47kWMD4FeDwKeL"
    ];
    gp_3.founder="5mockBaETAEcF56UHhAUNNvcZEejjJvixN8v4mwJRCXDf788";
    gp_3.manager="5mockBaETAEcF56UHhAUNNvcZEejjJvixN8v4mwJRCXDf788";
    gp_3.update=1700389555483;
    gp_3.last={
      msg:"重要的是把分工处理好，这样大家都好控制自己的时间",
      from:"5mock3DKUJzIpuzFn7vQJPeLAEdUMZiwfFARFrHYzccGiIhx",
    }
    const ct_1=JSON.parse(JSON.stringify(contact));
    ct_1.id="5EqaE823bX7ujSuj82B27BERuaQunGu6zzVbFv6LDDmZZB6v";
    ct_1.update=1700389755483;
    ct_1.last="你要参加比赛不？啥项目啊？";

    return [gp_1,gp_3,ct_1,gp_2];
  }