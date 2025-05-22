import fs from 'fs';
import path from 'path';
import archiver from 'archiver';

// === Configuration ===
const categories = ["admin", "moderation", "fun", "utility", "economy", "music", "premium", "misc"];
const commandsPerCategory = 25;
const basePath = "./BleedBot/commands";

// === Create folders and files ===
for (const category of categories) {
  const categoryPath = path.join(basePath, category);
  fs.mkdirSync(categoryPath, { recursive: true });

  for (let i = 1; i <= commandsPerCategory; i++) {
    const commandName = `${category}_command${i}`;
    const commandContent = `\
const {{ SlashCommandBuilder }} = require('discord.js');

module.exports = {{
  data: new SlashCommandBuilder()
    .setName('${commandName}')
    .setDescription('This is an auto-generated command: ${commandName}.'),
  async execute(interaction) {{
    await interaction.reply('Executed command: ${commandName}');
  }},
}};
`;

    fs.writeFileSync(path.join(categoryPath, `${commandName}.js`), commandContent);
  }
}

// === Zip the folder ===
const output = fs.createWriteStream('BleedBot_Commands.zip');
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
  console.log(`✅ Zip created: BleedBot_Commands.zip (${archive.pointer()} total bytes)`);
});

archive.on('error', err => { throw err; });

archive.pipe(output);
archive.directory('BleedBot/', false);
archive.finalize();
