let { mysql, createConnection, createPool } = require('mysql');
let config = require('../../config.json');
const { client, Discord, Util, MessageReaction } = require('discord.js');
const nodeutility = require('util');
var pool = require('./mysqlConnector');
// let connStat = "None";

function createTables() {
	pool.getConnection(function (err, connection) {
		let createRecaps = `create table if not exists recaps(
            id int primary key auto_increment,
            recap TEXT not null,
            link TEXT,
            posted int not null
        )`;

		connection.query(createRecaps, function (err, results, fields) {
			if (err) {
				console.log(err.message);
			}
		});
		connection.release();
		if (err) throw error;
	});
}

function addRecap(recap, link, posted, message) {
	pool.getConnection(function (err, connection) {
		let curedRecap = mysqlRealEscapeString(recap);
		var sql = `INSERT INTO recaps (recap, link, posted) VALUES ('${curedRecap}', '${link}', '${posted}')`;
		connection.query(sql, function (err, result) {
			if (err) {
				console.log(err);
				message.reply(`\`\`\`${err}\`\`\``);
				return;
			}
			console.log('[DATABASE] 1 record inserted');
			message.react('👍');
			const chunks = Util.splitMessage(recap);
			chunks.forEach((chunk, i) =>
				message.guild.channels.cache.get(`${config.modlogChannelID}`).send(`${message.author.tag} added to Recap :\n\`\`\`${chunk}\`\`\``)
			);
		});

		connection.release();
		if (err) throw error;
	});
}

function deleteRecap(id, message) {
	pool.getConnection(function (err, connection) {
		connection.query('SELECT MAX(id) AS highestID, MIN(id) AS lowestID FROM recaps;', function (err, results, fields) {
			if (err) {
				console.log(err.message);
				message.reply(`\`\`\`${err}\`\`\``);
				return;
			}

			if (Number(results[0]['highestID']) < Number(id) || Number(results[0]['lowestID']) > Number(id) || Number(id) < 0) {
				message.react('⛔');
				return message.reply(
					'The ID you have specified cannot be found within the databse.\n> Check if the specified ID is within the range.'
				);
			}

			var sql = `DELETE FROM recaps WHERE id='${id}';`;
			connection.query(sql, function (err, result) {
				if (err) {
					console.log(err);
					message.reply(`\`\`\`${err}\`\`\``);
					return;
				}
				console.log('[DATABASE] 1 record deleted');
				message.react('👍');
			});
		});

		connection.release();
		if (err) throw error;
	});
}

function recallRecap(id, message) {
	pool.getConnection(function (err, connection) {
		connection.query('SELECT MAX(id) AS highestID, MIN(id) AS lowestID FROM recaps;', function (err, results, fields) {
			if (err) {
				console.log(err.message);
				message.reply(`\`\`\`${err}\`\`\``);
				return;
			}

			if (Number(results[0]['highestID']) < Number(id) || Number(results[0]['lowestID']) > Number(id) || Number(id) < 0) {
				message.react('⛔');
				return message.reply(
					'The ID you have specified cannot be found within the databse.\n> Check if the specified ID is within the range.'
				);
			}

			var sql = `SELECT * FROM recaps WHERE id='${id}';`;
			connection.query(sql, function (err, result) {
				if (err) {
					message.reply(`\`\`\`${err}\`\`\``);
					return;
				}

				if (result < 0 || result == null || result == '') {
					message.react('❓');
					message.reply('Entry does not exist. It might have been deleted.');
				} else {
					console.log(`[DATABASE] Recap with ID ${id} has been recalled`);
					message.reply(`${result[0]['recap']}\n${result[0]['link']}`);
				}
			});
		});

		connection.release();
		if (err) throw error;
	});
}

function truncateRecap() {
	pool.getConnection(function (err, connection) {
		var sql = `TRUNCATE recaps';`;
		connection.query(sql, function (err, result) {
			if (err) {
				return console.log(err);
			}
			console.log('[DATABASE] : Recap table cleared');
		});

		connection.release();
		if (err) throw error;
	});
}

function editRecap(id, link, edit, message) {
	pool.getConnection(function (err, connection) {
		connection.query('SELECT MAX(id) AS highestID, MIN(id) AS lowestID FROM recaps;', function (err, results, fields) {
			if (err) {
				console.log(err.message);
				message.reply(`\`\`\`${err}\`\`\``);
				return;
			}

			if (Number(results[0]['highestID']) < Number(id) || Number(results[0]['lowestID']) > Number(id) || Number(id) < 0) {
				message.react('⛔');
				return message.reply(
					'The ID you have specified cannot be found within the databse.\n> Check if the specified ID is within the range.'
				);
			}
			parsedEdit = mysqlRealEscapeString(edit);
			var sql = '';
			if (link == true) {
				sql = `UPDATE recaps SET link='${parsedEdit}' WHERE id='${id}' ;`;
			} else {
				sql = `UPDATE recaps SET recap='${parsedEdit}' WHERE id='${id}' ;`;
			}

			connection.query(sql, function (err, result) {
				if (err) {
					return message.reply(`\`\`\`${err}\`\`\``);
				}
				console.log('[DATABASE] 1 record updated');
				console.log(`   > ID : ${id} `);
				console.log(`   > Link : ${link} `);
				console.log(`   > Edit : ${edit} `);

				message.react('👍');
			});
		});

		connection.release();
		if (err) throw error;
	});
}

function swapRecap(firstID, secondID, message) {
	pool.getConnection(function (err, connection) {
		connection.query('SELECT MAX(id) AS highestID, MIN(id) AS lowestID FROM recaps;', function (err, results, fields) {
			if (err) {
				console.log(err.message);
				message.reply(`\`\`\`${err}\`\`\``);
				return;
			}

			if (Number(results[0]['highestID']) < Number(firstID) || Number(results[0]['lowestID']) > Number(firstID) || Number(firstID) < 0) {
				message.react('⛔');
				return message.reply(
					'The ID you have specified cannot be found within the databse.\n> Check if the specified ID is within the range.'
				);
			}

			if (Number(results[0]['highestID']) < Number(secondID) || Number(results[0]['lowestID']) > Number(secondID) || Number(secondID) < 0) {
				message.react('⛔');
				return message.reply(
					'The ID you have specified cannot be found within the databse.\n> Check if the specified ID is within the range.'
				);
			}

			// Assining negative IDs in order to break unique values, no other ID is stored as a negative value as incrementation is from 0,
			// as such, this allows us to swap the IDs.

			var sql = `UPDATE recaps SET id = '-1' WHERE id = '${firstID}';`;
			connection.query(sql, function (err, result) {
				if (err) {
					message.reply(`\`\`\`${err}\`\`\``);
					return;
				}
			});

			var sql = `UPDATE recaps SET id = '-2' WHERE id = '${secondID}';`;
			connection.query(sql, function (err, result) {
				if (err) {
					message.reply(`\`\`\`${err}\`\`\``);
					return;
				}
			});

			// Swapping IDs based on the negative values.
			var sql = `UPDATE recaps SET id = '${firstID}' WHERE id = '-2';`;
			connection.query(sql, function (err, result) {
				if (err) {
					message.reply(`\`\`\`${err}\`\`\``);
					return;
				}
			});

			var sql = `UPDATE recaps SET id = '${secondID}' WHERE id = '-1';`;
			connection.query(sql, function (err, result) {
				if (err) {
					message.reply(`\`\`\`${err}\`\`\``);
					return;
				}
			});
		});

		console.log('[DATABASE] Records Swapped');
		console.log(`   > ID : ${firstID} <--> ${secondID}  `);

		message.react('👍');

		connection.release();
		if (err) throw error;
	});
}

function viewRecap(state, flag, message) {
	pool.getConnection(function (err, connection) {
		let recapText = '';
		let stmnt = 'SELECT * FROM recaps';

		if (state == 'today') {
			headerText = "Today's recap storage";
			stmnt = stmnt + ` WHERE posted=0`;
		} else {
			headerText = 'Recap Storage';
		}

		var sql = `${stmnt}`;
		connection.query(sql, function (err, rows, result) {
			if (err) {
				message.reply(`\`\`\`${err}\`\`\``);
				return;
			}
			rows.forEach(function (row) {
				recapText = recapText + `\n${row.id} : ${row.recap}\n${row.link}\n`;
			});

			if (recapText.length < 1) {
				recapText = 'There is no recap stored for today.';
			}

			if (flag == 'dm') {
				message.author.send(headerText);
				const chunks = Util.splitMessage(recapText, { maxLength: 1992 });
				chunks.forEach((chunk, i) => message.author.send(`\`\`\`${chunk}\`\`\``), { split: true });
			} else {
				message.channel.send(headerText);
				const chunks = Util.splitMessage(recapText, { maxLength: 1992 });
				chunks.forEach((chunk, i) => message.channel.send(`\`\`\`${chunk}\`\`\``), { split: true });
			}
		});
		connection.release();
		if (err) throw error;
	});
}

function postRecap(message) {
	pool.getConnection(function (err, connection) {
		let recapText = '';
		let posted = false;
		var sql = 'SELECT * FROM recaps WHERE posted=0 ORDER BY id ASC';
		connection.query(sql, function (err, rows, result) {
			if (err) {
				message.reply(`\`\`\`${err}\`\`\``);
				return;
			}

			rows.forEach(function (row) {
				recapText = recapText + `\n⁃ ${row.recap}\n`;
				if (!(row.link == null || row.link == '' || row.link <= 0)) {
					recapText = recapText + `${row.link}`;
				}
			});

			if (recapText < 0 || recapText == null || recapText == '') {
				message.reply('There is nothing to be posted.');
			} else {
				posted = true;
				const chunks = Util.splitMessage(recapText);
				message.guild.channels.cache.get(`${config.recapChannelID}`).send(`**Daily Recap ${new Date()}**`);
				chunks.forEach((chunk, i) => message.guild.channels.cache.get(`${config.recapChannelID}`).send(chunk));
				message.reply('Recap is being posted. Please wait for cleanup confirmation.');
			}
		});
		var sql = "UPDATE recaps SET posted='1'";
		connection.query(sql, function (err, rows, result) {
			if (err) {
				message.reply(`\`\`\`${err}\`\`\``);
				return;
			}
			if (posted) {
				message.reply(':soap: Everything has been prepared for tomorrow.');
			}
		});

		connection.release();
		if (err) throw error;
	});
}

function databaseEval(command, message) {
	pool.getConnection(function (err, connection) {
		var sql = `${command};`;
		connection.query(sql, function (err, result) {
			console.log('[DATABASE] : Eval command sent!');
			console.log(`   > Executed by : ${message.author.tag}`);
			console.log(`   > Command : ${command}`);
			if (err) {
				return message.reply(`\`\`\`${err}\`\`\``);
			}
			if (result < 0 || result == null || result == '') {
				message.reply(
					'Command failed. The result cannot be fetched.\n> If you used ``SELECT, UPDATE, DELETE`` statement(s), the command might have failed if the database is empty!'
				);
			} else {
				const chunks = Util.splitMessage(nodeutility.inspect(result));
				chunks.forEach((chunk, i) => message.channel.send(`\`\`\`${chunk}\`\`\``));
			}
		});

		connection.release();
		if (err) throw error;
	});
}

function databaseSearch(searchTerm, isConfirmFlag, message) {
	pool.getConnection(function (err, connection) {
		let searchResult = '';
		var sql = `SELECT * FROM recaps WHERE LCASE(recap) LIKE '%${searchTerm}%'`;
		connection.query(sql, function (err, rows, result) {
			if (err) {
				message.reply(`\`\`\`${err}\`\`\``);
				return;
			}
			let sum = 0;
			rows.forEach(function (row) {
				searchResult = searchResult + `\n${row.id} : ${row.recap}\n${row.link}\n`;
				sum++;
			});

			if (searchResult.length < 1) {
				searchResult = 'No search results found.';
			}

			if (sum >= 15 && isConfirmFlag != true) {
				searchResult = `${sum} entries found. Please add a 'confirm' flag to your command as this may cause significant spam.`;
			}

			const chunks = Util.splitMessage(searchResult, { maxLength: 1992 });
			chunks.forEach((chunk, i) => message.channel.send(`\`\`\`${chunk}\`\`\``), { split: true });
		});
		connection.release();
		if (err) throw error;
	});
}

function mysqlRealEscapeString(str) {
	return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
		switch (char) {
			case '\0':
				return '\\0';
			case '\x08':
				return '\\b';
			case '\x09':
				return '\\t';
			case '\x1a':
				return '\\z';
			case '\n':
				return '\\n';
			case '\r':
				return '\\r';
			case '"':
			case "'":
			case '\\':
			case '%':
				return '\\' + char;
		}
	});
}

module.exports = {
	createTables,
	addRecap,
	deleteRecap,
	editRecap,
	postRecap,
	truncateRecap,
	recallRecap,
	swapRecap,
	viewRecap,
	databaseEval,
	databaseSearch
};
