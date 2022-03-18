const{Product,Category,Color,Size}=require('../../database/models');

const fs = require('fs');
const path=require('path');
const { Op } = require("sequelize");

const controller={


	productsList:async (req,res)=>{
		
		const category=req.params.categoryId;
		const productsList= await Product.findAll({
			
			where:{
				categoryId: Number(category)
			}
		});
		res.render("../views/products/productsList",{productsList})
	},

	createProduct: async (req,res) => {
		try{
			const size = await Size.findAll({});
			const colors = await Color.findAll({});
			const categories = await Category.findAll({});

			for (let i = 0; i< colors.length; i++){
				colors[i].name = colors[i].name.split("").slice(1).join("")
			}
			res.render("../views/products/createProduct",{category : categories, color : colors, size : size})
	} catch (err) {
		console.log(err)
	}
	},
	add :async (req, res) => {
		let a = Object.keys(req.body).filter((element)=>{
			return element.length<=2
		}) 
		for ( let i = 0;  i <a.length;i++){
			a[i] = a[i].split("").slice(1).join("")
		}

		const newProduct = await Product.create({
			name: req.body.productName,
			price: req.body.productPrice,
			discount: req.body.productDiscount,
			description: req.body.productDescription,
			quantity: 10,
			image1: req.files.image1? req.files.image1[0].filename : "default-image.png",
			image2: req.files.image2? req.files.image[0].filename : "default-image.png",
			image3: req.files.image3? req.files.image[0].filename : "default-image.png",
			image4: req.files.image4? req.files.image[0].filename : "default-image.png",
			categoryId: req.body.category
		});
		newProduct.addColor(a).then(()=>{});
		newProduct.addSize(req.body.size)
		.then(()=>{res.redirect("/")})
	}, 

	editProduct:(req,res)=>{
		let requestProduct= Product.findByPk(req.params.id);
		let requestCategories= Category.findAll();
		let requestSizes = Size.findAll();
		let requestColors = Color.findAll();
		Promise.all([requestProduct,requestCategories,requestColors,requestSizes])
			.then(function(product,categories,sizes,colors){
				res.render('editProduct',{product:product,categories:categories,sizes:sizes,colors:colors})
			}) 
		
	},

	search: (req, res) => {
		productToSearch=req.body.mainSearchBar;
		// return res.json({productToSearch});
		Product.findAll({
			
			where: {
				name: { 
				  [Op.like] : '%' + req.body.mainSearchBar + '%' 
				}
			  }, 
		})
		.then(product => {
			let searchArray = [];
			for ( let i = 0;  i < product.length; i++) {
				searchArray.push(product[i]);
			}
			if ( searchArray == "" ) {
			  res.redirect('/');
			} else {
				
			  res.render('./products/productSearch', { searchArray });
			}
		  })
		  .catch(error => {
			return res.send(error);
		  })


	}
}

module.exports = controller