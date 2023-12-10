using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UnityEngine;

namespace Assets.Scripts.Shared
{
    public static class TilesHelper
    {
        /// <summary>
        /// Helper method to return SelectionIndex or BoardIndex
        /// </summary>
        /// <param name="subName"></param>
        /// <returns></returns>
        public static int? GetTargetIndex(string subName)
        {
            if(Input.GetMouseButtonDown(0)) {
                Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
                RaycastHit hit;

                if(Physics.Raycast(ray, out hit) && hit.transform.name.StartsWith(subName))
                {
                    var idx = new String(hit.transform.name.Where(Char.IsDigit).ToArray());
                    return int.Parse(idx);
                }
            }

            return null;
        }
    }
}
