using System;
using System.Collections.Generic;
using System.Text;

namespace Substrate.Hexalem.NET.AI
{
    public class PlayAction
    {
        private PlayAction() { }

        public bool CanPlay { get; set; }
        public int? SelectionIndex { get; set; }
        public (int q, int r)? Coords { get; set; }

        public static PlayAction CannotPlay() => new PlayAction() { CanPlay = false };
        public static PlayAction Play(int index, (int, int) coords) => new PlayAction() { 
            CanPlay = true,
            SelectionIndex = index,
            Coords = coords
        };
    }
}
