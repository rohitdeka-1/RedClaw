import { Product } from "../models/Product.model.js";
import { connectDb } from "../database/db.js";
import dotenv from "dotenv";

dotenv.config();

const products = [
	{
		name: "RedClaw Viper",
		description: "Engineered for speed and accuracy, every click delivers pure performance. Designed to dominate your gameplay, unleash your potential.",
		price: 2999,
		coverImage: "/mouse.png",
		images: ["/mouse.png"],
		category: "Gaming Mice",
		stock: 50,
		isFeatured: true,
		isAvailable: true
	},
	{
		name: "RedClaw Phantom",
		description: "Ultra-silent clicks with devastating accuracy, moving unseen through the digital realm. Built for stealth and speed.",
		price: 3499,
		coverImage: "/mouse2.png",
		images: ["/mouse2.png"],
		category: "Gaming Mice",
		stock: 30,
		isFeatured: true,
		isAvailable: true
	},
	{
		name: "RedClaw Inferno",
		description: "Blazing fast response time with molten performance. Ignite your potential and conquer every competition.",
		price: 2799,
		coverImage: "/mouse.png",
		images: ["/mouse.png"],
		category: "Gaming Mice",
		stock: 40,
		isFeatured: true,
		isAvailable: true
	}
];

const seedProducts = async () => {
	try {
		await connectDb();
		
		// Clear existing products
		await Product.deleteMany({});
		console.log("Cleared existing products");

		// Insert new products
		const createdProducts = await Product.insertMany(products);
		console.log("\n✅ Products seeded successfully:");
		createdProducts.forEach(p => {
			console.log(`   - ${p.name} (ID: ${p._id})`);
		});

		console.log("\n📋 Use these ObjectIds in your frontend:\n");
		console.log("const productIds = {");
		createdProducts.forEach(p => {
			const key = p.name.split(" ")[1].toLowerCase(); // viper, phantom, inferno
			console.log(`  ${key}: "${p._id}",`);
		});
		console.log("};\n");

		process.exit(0);
	} catch (error) {
		console.error("❌ Error seeding products:", error);
		process.exit(1);
	}
};

seedProducts();
