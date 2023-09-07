module.exports = {
  async execute(interaction: any) {
    await interaction.reply({
      content: 'There was an issue fetching this modal!',
      ephemeral: true,
    });
    return;
  },
};
