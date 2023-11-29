using Serilog;
using Substrate.Hexalem.NET.AI;

namespace Substrate.Hexalem.Console
{
    public class Program
    {
        //public List<IThinking> Bots { get; set; }


        static void Main(string[] args)
        {
            Log.Logger = new LoggerConfiguration()
              .MinimumLevel.Information()
              .WriteTo.Console()
              .CreateLogger();

            var play = new Play(new List<AI>() { new NET.AI.Random(0), new MinMax(1, 3) });

            play.StartGame();
        }
    }
}
