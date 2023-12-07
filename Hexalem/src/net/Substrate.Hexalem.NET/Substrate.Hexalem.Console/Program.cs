using Serilog;

namespace Substrate.Hexalem.Console
{
    public class Program
    {
        //public List<IThinking> Bots { get; set; }


        static async Task Main(string[] args)
        {
            Log.Logger = new LoggerConfiguration()
              .MinimumLevel.Information()
              .WriteTo.Console()
              .CreateLogger();

            //var play = new Play(new List<AI>() { new NET.AI.Random(0), new MinMax(1, 3) });
            //play.StartGame();

            var node = new HexalemNode();
            await node.InitAsync(CancellationToken.None);

            System.Console.ReadLine();
        }
    }
}
