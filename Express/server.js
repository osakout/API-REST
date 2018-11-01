var express = require('express');
var bodyParser = require("body-parser"); 
var app = express();
var myRouter = express.Router();
var hostname = 'localhost';
var port = '8080';
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "RTP_API",
  port: "3306",
  socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Route d'indexe


//Route /api/domains.json

/*myRouter.route('/api/domains.json')
.get(function(req,res){
	res.json({
req.status.
	methode: req.method});
});*/

myRouter.route("/api/recipes(.:var)")
.get(function(req, res){
	if(req.params.var == "json")
	{
		if (req.query.name){
		con.query(" SELECT id, name, slug FROM `recipes__recipe` WHERE name LIKE '%" + req.query.name + "%' ", function(error, recipes, fields) {
			if (error) throw error;
			let recipe = recipes[0]
			console.log(req.query.name)
			return res.send({code: 200, message: "OK", datas: recipes});
		});} else {
			con.query(' SELECT id, name, slug FROM `recipes__recipe` ', function(error, results, fields) {
                        if (error) throw error;
                        return res.send({code: 200, message: "ok", datas: results});
                });
}
	}
	else
	{
		return res.status(400).send({code:400, message:"error", datas:[] });
	}
});

myRouter.route('/api/recipes/(:slug)(.:json)')
.get(function(req, res){
        if(req.params.json == "json"){
            //if (error) throw error;
        
        con.query(" SELECT id, name FROM `recipes__recipe` WHERE slug='" + req.params.slug + "' ", function(error, recipes, fields) {
            if (error) throw error;
            let recipe = recipes[0];
            con.query('SELECT username, last_login, users__user.id FROM users__user WHERE users__user.id=1', function(error, users, fields){
                if (error) throw error;
                let user = users[0]
                return res.send({
	                "code": 200,
	                "message": "OK",
	                "datas": {
		                "id": recipe.id,
		                "name": recipe.name,
		                "user": {
			                "username": user.username,
			                "last_login": user.last_login,
			                "id": user.id
		                },
		                "slug": req.params.slug
	                 }
                      });
            });
         });
        }
        else {
            return res.status(400).send({code:400, message:"error", datas:[] });
        }
});

myRouter.route('/api/recipes/(:slug)/steps(.:var)')
.get(function(req, res){
        if(req.params.var == "json")
        {
		//if (error) throw error;
		if (req.params.slug == "american-fries" || req.params.slug == "vegeta-rien" || req.params.slug == "cola" || req.params.slug == "apple-pie" ){
                	con.query(' SELECT step FROM `recipes__recipe` WHERE slug="' + req.params.slug + '" ', function(error, results, fields) {
                        if (error) throw error;
var stepArray = results[0].step;
				console.log(Array.isArray(stepArray));
				var ArrSTEP = stepArray.split(",");
				console.log(Array.isArray(ArrSTEP));
                        	return res.send({code: 200, message: "OK", datas: ArrSTEP});
			});
		} else { return res.status(404).send({code:404, message:"Not Found", datas:[] }) }
}        
else
        {
                return res.status(400).send({code:400, message:"error"});
        }
});

myRouter.route('/api/recipes(.:json)')
.post(function(req, res){
console.log(req.headers);
//var body = req.body('step');
//console.log(body);
console.log(req.body)
//console.log(req.body.step[0]);
console.log(req.body.step);
	if (req.params.json == "json") {
	if (req.headers.authorization == "passworddelilelulo" || req.headers.authorization == "passworddeetna"){
		con.query("SELECT username, last_login, id FROM users__user WHERE password='" + req.headers.authorization + "' ", function (error, users, fields){
			if (error) throw error;
			let user = users[0];
			con.query("INSERT INTO `recipes__recipe`(`id`, `user_id`, `name`, `slug`, `step`) VALUES ('','" + user.id + "', '" + req.body.name + "', '" + req.body.slug + "','" + req.body.step + "')", function (error, results, fields) {
                                if (error) throw error;
                                //return res.send({datas: "test"});
                        })
			con.query(" SELECT id, name, step FROM `recipes__recipe` WHERE slug='" + req.body.slug + "'", function (error, recipes, fields){
                        	if (error) throw error;
//console.log(req.body.step);
				console.log(recipes[0]);
                        	let recipe = recipes[0];
				var ArrStep = recipe.step.split(",");
				return res.send({
						"code": 201,
						"message": "Created",
						"datas": {
							"id": recipe.id,
							"name": recipe.name,
							"user": {
								"username": user.username,
								"last_login": user.last_login,
								"id": user.id
							},
							"slug": req.body.slug,
							"step": ArrStep
						}
					})
                        })
		})} else { return res.status(401).send({"code": 401, "message": "Unhautorized"}) }
	}
})

myRouter.route('/api/recipes/(:slug)(.:json)')
.put(function(req, res){
	if (req.params.json	 == "json") {
		var SELECT = 0;
		if (req.body.slug != undefined && req.params.slug == undefined){
			SELECT = "SELECT id, user_id, name, slug, step FROM recipes__recipe WHERE slug='" + req.body.slug + "'"
                    }
                    else if (req.body.slug != undefined && req.params.slug != undefined){
                        SELECT = "SELECT id, user_id, name, slug, step FROM recipes__recipe WHERE slug='" + req.body.slug + "'"
                    }
		    else if (req.body.slug == undefined && req.params.slug != undefined){
                        SELECT = "SELECT id, user_id, name, slug, step FROM recipes__recipe WHERE slug='" + req.params.slug + "'"
                    }
		con.query("SELECT id, user_id, name, slug FROM recipes__recipe WHERE slug='" + req.params.slug + "'", function(error, recipes, fields){
			if (error) throw error;
			let recipe = recipes[0];
			if (recipe == undefined){
				return res.status(404).send({code:404, message:"Not Found"});
			}
		con.query("SELECT username, last_login, id, password FROM users__user WHERE id=" + recipe.user_id + "", function(error, passwords, fields){
                                if (error) throw error;
                                let password = passwords[0];
                                if (password.password != req.headers.authorization) {
                                        return res.status(403).send({"code": 403, "message": "Forbidden"});
                                }
		con.query("SELECT slug FROM recipes__recipe WHERE slug='" + req.body.slug + "'", function(error, formulaires, fields){
			let formulaire = formulaires[0];
			if (req.body.name == ""){
				return res.status(400).send({code: 400, message:"Bad Request", datas:[]});
			}
			else if (formulaire != undefined) {
				return res.status(400).send({code: 400, message:"Bad Request", datas:[]});
			}
		
				var REQUETE = 0 ;
				if (req.body.name != undefined && req.body.slug == undefined && req.body.step == undefined){
                                         REQUETE = "UPDATE recipes__recipe SET name='" + req.body.name + "' WHERE slug='" + req.params.slug + "' "
                                }
				else if (req.body.name == undefined && req.body.slug != undefined && req.body.step == undefined){
                                         REQUETE = "UPDATE recipes__recipe SET slug='" + req.body.slug + "' WHERE slug='" + req.params.slug + "' "
                                }
				else if (req.body.name == undefined && req.body.slug == undefined && req.body.step != undefined){
                                         REQUETE = "UPDATE recipes__recipe SET step='" + req.body.step + "' WHERE slug='" + req.params.slug + "' "
                                }
				else if (req.body.name != undefined && req.body.slug != undefined && req.body.step == undefined){
                                         REQUETE = "UPDATE recipes__recipe SET name='" + req.body.name + "', slug='" + req.body.slug + "' WHERE slug='" + req.params.slug + "' "
                                }
				else if (req.body.name == undefined && req.body.slug != undefined && req.body.step != undefined){
					 REQUETE = "UPDATE recipes__recipe SET slug='" + req.body.slug + "', step='" + req.body.step + "' WHERE slug='" + req.params.slug + "' "
				}
				else if (req.body.name != undefined && req.body.slug == undefined && req.body.step != undefined){
                                         REQUETE = "UPDATE recipes__recipe SET name='" + req.body.name + "', step='" + req.body.step + "' WHERE slug='" + req.params.slug + "' "
                                }
				else if (req.body.name != undefined && req.body.slug != undefined && req.body.step != undefined ){
                                         REQUETE = "UPDATE recipes__recipe SET name='" + req.body.name + "', slug='" + req.body.slug + "', step='" + req.body.step + "' WHERE slug='" + req.params.slug + "' "
                                }
console.log(REQUETE);
				con.query(REQUETE, function (error, results, fields){
					if (error) throw error;
					let result = results[0]
					con.query(SELECT, function (error, RECIPE, fields){
						let RECIPES = RECIPE[0];
					console.log(RECIPES.step)
						if (RECIPES.step != undefined){
							var ArrStep = RECIPES.step.split(",");
							return res.status(200).send({
                                                        "code": 200,
                                                        "message": "OK",
                                                        "datas": {
                                                                "id": RECIPES.id,
                                                                "name": RECIPES.name,
                                                                "user": {
                                                                        "username": password.username,
                                                                        "last_login": password.last_login,
                                                                        "id": password.id
                                                                },
                                                                "slug": RECIPES.slug,
								"step": ArrStep
                                                        }})
						}
						return res.status(200).send({
                        				"code": 200,
			                        	"message": "OK",
							"datas": {
                                				"id": RECIPES.id,
                                				"name": RECIPES.name,
                                				"user": {
                                        				"username": password.username,
                                        				"last_login": password.last_login,
                                        				"id": password.id
                                				},
                                				"slug": req.params.slug
                         				}
                      				});
					})
				})
                	})
		})})
	} else {
		return res.status(400).send({code:400, message:"error"});
	}
})
/*myRouter.route('/api/domains/(:name)(.:json)')
.get(function(req, res) {
	if (req.params.json == "json") {

	con.query("SELECT GROUP_CONCAT( `lang_id` ) AS langs ,username, user.id AS user_id, domain.id,slug,name,description,created_at FROM domain INNER JOIN user ON domain.user_id = user.id INNER JOIN domain_lang ON domain.id = domain_lang.domain_id WHERE name='"+req.params.name+"' ", function(error, results, fields) {
			if (error) throw error;

			results[0].langs = results[0].langs.split(",");
			results[0].creator = {
				id: results[0].user_id,
				username: results[0].username
			}
			var created = results[0].created_at;
			delete results[0].created_at;
			delete results[0].user_id;
			delete results[0].username;
			results[0].created_at = created;
			return res.send({code: 200, message: "success", datas: results});
		});
		} else {
			return res.status(400).send({code:400, message:"error", datas:[] });
		}
});
*/

myRouter.route('/api/recipes/(:slug)(.:json)')
.delete(function(req, res){
	if (req.params.json == "json") {
		con.query("SELECT id, user_id, name, slug FROM recipes__recipe WHERE slug='" + req.params.slug + "'", function(error, recipes, fields){
                        if (error) throw error;
                        let recipe = recipes[0];
                        if (recipe == undefined){
                                return res.status(404).send({code:404, message:"Not Found"});
                        }
			con.query("SELECT username, last_login, id, password FROM users__user WHERE id=" + recipe.user_id + "", function(error, passwords, fields){
                                        if (error) throw error;
                                        let password = passwords[0];
                                        if (password.password != req.headers.authorization) {
                                                return res.status(403).send({"code": 403, "message": "Forbidden"});
                                        }
				//if (req.params.slug == ""){
				//	return res.status(400).send({code: 400, message:"Bad Request", datas:[]});
				//}
				con.query("DELETE FROM `recipes__recipe` WHERE `id` ='" + recipe.id + "' ", function(error, results, fields){
					return res.status(200).send({	"code": 200, "message": "success", "datas": { "id": recipe.id }})
				})
                        })
		})
	}
})
/*
myRouter.route('/api/recipes(.:var)?name=(:filter)')
.get(function(req, res){
        if(req.params.var == "json")
        {
                con.query(" SELECT id, name, slug FROM `recipes__recipe` WHERE name LIKE '%" + req.params.filter + "%' ", function(error, recipes, fields) {
                        if (error) throw error;
			let recipe = recipes[0];
			console.log(req.params.filter)
                        return res.send({code: 200, message: "OK", datas: results});
                });
        }
        else
        {
                return res.status(400).send({code:400, message:"error", datas:[] });
        }
})*/
/*
myRouter.route('*')
.all(function(req,res){
	res.status(404).json({
		code: 404,
		message: "not found"
	});
});*/

//On demande à l'application d'utiliser notre router

app.use(myRouter);

//Démarrage du serveur

app.listen(port, hostname, function(){
	console.log("Mon serveur fonctionne sur http://" + hostname + ":" + port);
});
