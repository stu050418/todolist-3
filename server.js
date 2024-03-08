const http = require('http');
const errorHeader = require('./errorHeader');
let todos = [];
const { v4: uuidv4 } = require('uuid');
// uuidv4(); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'


const reqList = (req, res) =>{
  const headers ={
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
    'Content-Type': 'application/json'
  }
  let body = "";

  // on 跟 no
  req.on("data", chunk=>{
    body+=chunk;
  });

  if(req.url == "/todos" && req.method == "GET"){
    res.writeHead(200, headers);
    res.write(JSON.stringify({
      "status": "success",
      "data": todos,
    }));
    res.end();

  }else if(req.url == "/todos" && req.method == "POST"){
    req.on("end", ()=>{

      try
      {
        const title = JSON.parse(body).title;

        if(title != null){
          let todo = {
            "title":title,
            "id": uuidv4(),
          }
          todos.push(todo);

          res.writeHead(200, headers);
          res.write(JSON.stringify({
            "status": "success",
            "data": todos,
          }));
          res.end();
        }else{
          errorHeader(res, 400, "資料格式錯誤");
        }
      }
      catch(error)
      {
        errorHeader(res, 400, "資料格式錯誤");
      }

    });
  }else if(req.url.startsWith("/todos/") && req.method == "POST"){
    req.on("end", ()=>{

      try
      {
        let id = req.url.split("/").pop();
        let index = todos.findIndex(itme => itme.id == id);
        const title = JSON.parse(body).title;

        if(title != null && index != -1){
          todos[index].title = title;

          res.writeHead(200, headers);
          res.write(JSON.stringify({
            "status": "success",
            "data": todos,
          }));
          res.end();
        }else{
          errorHeader(res, 400, "資料格式或ID有誤");
        }
      }
      catch(error)
      {
        errorHeader(res, 400, "資料格式或ID有誤");
      }

    });

  }else if(req.url == "/todos" && req.method == "DELETE"){

    todos.length = 0;

    res.writeHead(200, headers);
    res.write(JSON.stringify({
      "status": "success",
      "data": todos,
    }));
    res.end();
  }else if(req.url.startsWith("/todos/") && req.method == "DELETE"){
  
    let id = req.url.split("/").pop();
    let index = todos.findIndex(itme => itme.id == id);

    if(index != -1){
      todos.splice(index,1);
      res.writeHead(200, headers);
      res.write(JSON.stringify({
        "status": "success",
        "data": todos,
      }));
      res.end();
      
    }else{
      errorHeader(res, 400, "資料格式或ID有誤");
    }

  }else if(req.url == "/" && req.method == "OPTIONS"){
    res.writeHead(200, headers);
    res.write(JSON.stringify({
      "status": "success",
      "data": todos,
    }));
    res.end();
  }else{
    errorHeader(res, 404, "無此網路");
  }

};

const server = http.createServer(reqList);
server.listen(process.env.PORT || 3005);
