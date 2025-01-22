var express = require("express");
var router = express.Router();
const request = require("request");
const axios = require("axios");

const url_line_notification = "https://notify-api.line.me/api/notify";

router.get("/test", async function (req, res, next) {
    try {

        const {text, orderId} = req.body;
        
        
        request({
            method: 'POST',
            uri: url_line_notification,
            header: {
                'Content-Type': 'multipart/form-data',
            },
            auth: {
                bearer: process.env.LINE_TOKEN_NOTIFY,
            },
            form: {
                message: 'text : ' + text + ' orderId : ' + orderId,
            },
        }, (err, httpResponse, body) => {
            if (err) {
                console.log(err)
            } else {
                console.log(body)
            }
        });

        res.send({
            status: 200,
            message: "success",
        });

    } catch (error) {
        res.status(500).send(error.toString());
    }
});

router.get("/test2", async function (req, res, next) {
    const token = process.env.LINE_TOKEN_NOTIFY2;

    const {message} = req.body;

    try {
       let result = await axios({
        method: 'post',
        url: 'https://notify-api.line.me/api/notify',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${token}`
        },
        data : `message= ${message}`,
        
       }).then((response) => {
           console.log( "line" + response);
       });

       res.send({ 
           status: 200,
           message: "success",
           data: "send line success"
       });

    } catch (error) {
        res.status(500).send(error.toString());
    }
});

router.post("/send_message", async function (req, res, next) {
  const { text, order_number } = req.body;
  const lineUserId = "Uaca94e2d946dbf1d343a93c8682078b3";
  const paramsEmpty = [];

  if (!text) paramsEmpty.push("text");
  if (!order_number) paramsEmpty.push("order_number");

  if (paramsEmpty.length > 0) {
    const paramsEmptyString = paramsEmpty.join(",");
    const errorResponse = {
      result: "Error",
      code: 400,
      message: `${paramsEmptyString} ไม่สามารถเป็นค่าว่างได้`,
      generate_id: generateID,
    };
    return res.status(400).json(errorResponse);
  }
  // Validate environment variables
  // if (!process.env.LINE_MESSAGE || !process.env.LINE_TOKEN) {
  //   return res.status(500).json({
  //     result: "Error",
  //     code: 500,
  //     message: "LINE API credentials are not set correctly.",
  //   });
  // }
  try {
    const sendMessage = {
      type: "flex",
      altText: "สถานะคำสั่งซื้อของคุณ",
      contents: {
        type: "bubble",
        direction: "ltr",
        header: {
          type: "box",
          layout: "vertical",
          contents: [
            { type: "text", text: text, size: "sm", align: "start" },
            { type: "text", text: `รหัสการสั่งซื้อ : ${order_number}`, size: "sm", align: "start" },
            { type: "text", text: `วันที่ : 2021-06-17 15:00:00`, size: "sm", align: "start" }
          ],
        },
      },
    };
    // if (text !== 'ยกเลิกคำสั่งซื้อ') {
    //   sendMessage.contents.footer = {
    //     type: "box",
    //     layout: "vertical",
    //     contents: [
    //       {
    //         type: "button",
    //         style: "primary",
    //         height: "sm",
    //         action: {
    //           type: "uri",
    //           label: "ติดตามสถานะขนส่ง",
    //           uri: "https://www.google.com",
    //         },
    //       },
    //     ],
    //   };
    // }

    const config = {
      method: "post",
      url: process.env.LINE_MESSAGE + "/push",
      headers: {
        Authorization: "Bearer " + process.env.LINE_TOKEN,
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        to: lineUserId,
        messages: [sendMessage],
      }),
    };

    console.log('Config:', config);  // Log the configuration for debugging

    try {
      const result = await axios(config);
      console.log('Result:', result);  // Log the result for debugging

      const response = {
        result: "Success",
        code: 200,
        message: "Send Message Success",
        data: [],
      };
      return res.json(response);
    } catch (err) {
      console.log('Error:', err);  // Log the error for debugging
      const code = err.response ? err.response.status : 500;
      const errorLine = err.response ? err.response.data : {};

      const errorResponse = {
        result: "Error",
        code: code,
        message: "ระบบ ส่งข้อความ เกิดข้อผิดพลาด",
        error_detail: errorLine
      };

      return res.status(code).json(errorResponse);
    }
  } catch (err) {
    console.log('Error:', err);  // Log the error for debugging

    const errorResponse = {
      result: "Error",
      code: 500,
      message: "เกิดข้อผิดพลาดกรุณาติดต่อเจ้าหน้าที่",
      err_message: err.message,
    };
    return res.status(500).json(errorResponse);
  }
});

module.exports = router;