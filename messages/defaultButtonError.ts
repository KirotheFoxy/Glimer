module.exports = {
  async execute(interaction: any) {
    await interaction.reply({
      content: 'There was an issue while fetching this button!',
      ephemeral: true,
    });
    return;
  },
};
