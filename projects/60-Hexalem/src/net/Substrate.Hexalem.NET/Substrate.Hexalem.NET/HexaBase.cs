namespace Substrate.Hexalem.Engine
{
    public interface IHexaBase
    {
        /// <summary>
        /// Init an hexa item
        /// </summary>
        /// <param name="blockNumber"></param>
        public void Init(uint blockNumber);

        /// <summary>
        /// Action to perform on next round
        /// </summary>
        /// <param name="blockNumber"></param>
        public void NextRound(uint blockNumber);

        /// <summary>
        /// Trigger after a player move
        /// </summary>
        /// <param name="blockNumber"></param>
        public void PostMove(uint blockNumber);
    }
}