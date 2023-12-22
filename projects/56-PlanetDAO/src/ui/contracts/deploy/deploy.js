
// Just a standard hardhat-deploy deployment definition file!
const func = async (hre) => {
	const { deployments, getNamedAccounts } = hre;
	const { deploy } = deployments;
	const { deployer } = await getNamedAccounts();


	await deploy('PlanetDAO', {
		from: deployer,
		log: true,
	});

	var fs = require('fs');
	var json = JSON.parse(fs.readFileSync('./deployments/moonbase/PlanetDAO.json', 'utf8'));

	fs.writeFileSync("address.txt", json.address, {
		encoding: 'utf8',
		flag: 'w'
	  });
	
};

module.exports = func;