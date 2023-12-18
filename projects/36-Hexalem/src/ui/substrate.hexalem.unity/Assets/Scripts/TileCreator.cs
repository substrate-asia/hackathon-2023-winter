using Assets.Scripts;
using Substrate.Hexalem.Engine;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace Assets.Scripts
{
    public class TileCreator : Singleton<TileCreator>
    {
        [SerializeField]
        private GameObject _emptyTile;

        [SerializeField]
        private GameObject _homeTile;

        [SerializeField]
        private GameObject _rareHomeTile;

        [SerializeField]
        private GameObject _epicHomeTile;

        [SerializeField]
        private GameObject _grassTile;

        [SerializeField]
        private GameObject _waterTile;

        [SerializeField]
        private GameObject _mountainTile;

        [SerializeField]
        private GameObject _treesTile;

        [SerializeField]
        private GameObject _desertTile;

        [SerializeField]
        private GameObject _caveTile;

        [SerializeField]
        private Material _delta;

        // Start is called before the first frame update
        void Start()
        {

        }

        // Update is called once per frame
        void Update()
        {

        }

        public GameObject CreateTile(TileType tileType, byte tileRarity, TilePattern tilePattern, Transform gridParent)
        {
            GameObject tile;
            switch (tileType)
            {
                case TileType.Empty:
                    tile = Instantiate(_emptyTile, gridParent);
                    break;

                case TileType.Home:
                    if (tileRarity == 1)
                    {
                        tile = Instantiate(_rareHomeTile, gridParent);
                    }
                    else if (tileRarity == 2)
                    {
                        tile = Instantiate(_epicHomeTile, gridParent);
                    }
                    else
                    {
                        tile = Instantiate(_homeTile, gridParent);
                    }

                    break;

                case TileType.Grass:
                    tile = Instantiate(_grassTile, gridParent);
                    break;

                case TileType.Water:
                    tile = Instantiate(_waterTile, gridParent);
                    break;

                case TileType.Mountain:
                    tile = Instantiate(_mountainTile, gridParent);
                    break;

                case TileType.Tree:
                    tile = Instantiate(_treesTile, gridParent);
                    break;

                case TileType.Desert:
                    tile = Instantiate(_desertTile, gridParent);
                    break;

                case TileType.Cave:
                    tile = Instantiate(_caveTile, gridParent);
                    break;

                default:
                    tile = Instantiate(_emptyTile, gridParent);
                    break;
            }

            if (tilePattern == TilePattern.Delta)
            {
                tile.GetComponent<MeshRenderer>().material = _delta;
            }

            return tile;
        }
    }
}

