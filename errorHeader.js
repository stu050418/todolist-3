function errorHeader(res, num, msg){
  const headers ={
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
   'Content-Type': 'application/json'
 }

 res.writeHead(num, headers);
 res.write(JSON.stringify({
   "status": "success",
   "message": msg,
 }));
 res.end();

}

module.exports = errorHeader;