const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kicks a member from the server')
    .addUserOption(option =>
      option.setName('user').setDescription('User to kick').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const member = interaction.guild.members.cache.get(user.id);

    if (!member.kickable) {
      return interaction.reply({ content: 'I cannot kick this user.', ephemeral: true });
    }

    await member.kick();
    await interaction.reply(`${user.tag} has been kicked.`);
  }
};
