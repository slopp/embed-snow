// server/index.js
const path = require('path');
const express = require("express");
var crypto = require('crypto');
var querystring = require('querystring')


const PORT = process.env.PORT || 8080;

const app = express();

app.get("/auth", (req, res) => {

    // default data
    options = {
        host: 'dev.looker.loppdev.com',
        secret: '',
        external_user_id: '8',
        first_name: 'Embed',
        last_name: 'User',
        permissions: ['see_user_dashboards', 'see_lookml_dashboards', 'access_data', 'see_looks'],
        models: ['snow'],
        embed_url: "/embed/dashboards/1",
        force_logout_login: false,
        session_length: 86400
    };
    console.log("Signing URL")
    var url = created_signed_embed_url(options) 
    console.log(url)
    res.json({
        url: url
    })
})

app.use(express.static(path.join(__dirname,"../build")));

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});


function nonce(len) {
   var text = "";
   var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

   for (var i = 0; i < len; i++)
   text += possible.charAt(Math.floor(Math.random() * possible.length));

   return text;
}

function forceUnicodeEncoding(string) {
   return decodeURIComponent(encodeURIComponent(string));
}

function created_signed_embed_url(options) {
   // looker options
   var secret = options.secret;
   var host = options.host;

   // user options
   var json_external_user_id = JSON.stringify(options.external_user_id);
   var json_first_name = JSON.stringify(options.first_name);
   var json_last_name = JSON.stringify(options.last_name);
   var json_permissions = JSON.stringify(options.permissions);
   var json_models = JSON.stringify(options.models);
   var json_group_ids = JSON.stringify(options.group_ids);
   var json_external_group_id = JSON.stringify(options.external_group_id || "");
   var json_user_attributes = JSON.stringify(options.user_attributes || {});
   var json_access_filters = JSON.stringify(options.access_filters);

   // url/session specific options
   var embed_path = '/login/embed/' + encodeURIComponent(options.embed_url);
   var json_session_length = JSON.stringify(options.session_length);
   var json_force_logout_login = JSON.stringify(options.force_logout_login);

   // computed options
   var json_time = JSON.stringify(Math.floor((new Date()).getTime() / 1000));
   var json_nonce = JSON.stringify(nonce(16));

   // compute signature
   var string_to_sign = "";
   string_to_sign += host + "\n";
   string_to_sign += embed_path + "\n";
   string_to_sign += json_nonce + "\n";
   string_to_sign += json_time + "\n";
   string_to_sign += json_session_length + "\n";
   string_to_sign += json_external_user_id + "\n";
   string_to_sign += json_permissions + "\n";
   string_to_sign += json_models + "\n";
   string_to_sign += json_group_ids + "\n";
   string_to_sign += json_external_group_id + "\n";
   string_to_sign += json_user_attributes + "\n";
   string_to_sign += json_access_filters;

   var signature = crypto.createHmac('sha1', secret).update(forceUnicodeEncoding(string_to_sign)).digest('base64').trim();

   // construct query string
   var query_params = {
       nonce: json_nonce,
       time: json_time,
       session_length: json_session_length,
       external_user_id: json_external_user_id,
       permissions: json_permissions,
       models: json_models,
       access_filters: json_access_filters,
       first_name: json_first_name,
       last_name: json_last_name,
       group_ids: json_group_ids,
       external_group_id: json_external_group_id,
       user_attributes: json_user_attributes,
       force_logout_login: json_force_logout_login,
       signature: signature
   };

   var query_string = querystring.stringify(query_params);

   return 'https://' + host + embed_path + '?' + query_string;
}
