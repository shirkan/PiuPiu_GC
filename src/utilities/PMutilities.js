/**
 * Created by shirkan on 1/6/15.
 */

//  TODO: convert to GC

var PluginManager = plugin.PluginManager.getInstance();

//  IAP
var IAPManager = null;
function IAPinit() {
    IAPManager = PluginManager.loadPlugin("IOSIAP");
    IAPManager.setListener(this);
    //IAPsetServerMode();
}

function IAPsetServerMode() {
    IAPManager.callFuncWithParam("setServerMode");
}

function IAPrequestProducts(products) {
    IAPManager.callFuncWithParam("requestProducts", plugin.PluginParam(plugin.PluginParam.ParamType.TypeString, products.toString()));
}

//  DO NOT CHANGE THIS FUNCTION NAME - requestProducts looks for this function
function onRequestProductResult (ret, productInfo) {
    var msgStr = "";
    if (ret == plugin.ProtocolIAP.RequestProductCode.RequestFail) {
        msgStr = "onRequestProductResult: request error";
    } else if (ret == plugin.ProtocolIAP.RequestProductCode.RequestSuccess) {
        LOG("onRequestProductResult productInfo " + JSON.stringify(productInfo))
        msgStr = "onRequestProductResult: list: [";
        for (var i = 0; i < productInfo.length; i++) {
            var product = productInfo[i];
            msgStr += product.productName + " ";
        }
        msgStr += " ]";
    }
    LOG(msgStr);
    IAPpayForProduct(productInfo[0]);
}

function IAPpayForProduct(product) {
    IAPManager.payForProduct(product);
}

function onPayResult (ret, msg, productInfo) {
    var str = "";
    if (ret == plugin.ProtocolIAP.PayResultCode.PaySuccess) {
        str = "onPayResult payment Success pid is " + productInfo.productId;
        //if you use server mode get the receive message and post to your server
        str += " payment verify from server " + msg;
    } else if (ret == plugin.ProtocolIAP.PayResultCode.PayFail) {
        str = "onPayResult payment fail";
    }
    LOG(str);
}

function finishTransaction() {
    LOG("finishTransaction");
}
//  ADMOB