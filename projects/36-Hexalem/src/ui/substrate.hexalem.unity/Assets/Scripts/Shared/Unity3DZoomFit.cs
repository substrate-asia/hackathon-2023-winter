using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UnityEngine;

namespace Assets.Scripts.Shared
{
    internal static class Unity3DZoomFit
    {
        internal static Bounds GetBound(GameObject go)
        {
            Bounds b = new Bounds(go.transform.position, Vector3.zero);
            var rList = go.GetComponentsInChildren(typeof(Renderer));
            foreach (Renderer r in rList)
            {
                b.Encapsulate(r.bounds);
            }
            return b;
        }

        /// <summary>
        /// Adjust the camera to zoom fit the game object
        /// There are multiple directions to get zoom-fit view of the game object,
        /// if ViewFromRandomDirecion is true, then random viewing direction is chosen
        /// else, the camera's forward direction will be sused
        /// </summary>
        /// <param name="c"> The camera, whose position and view direction will be 
        //                   adjusted to implement zoom-fit effect </param>
        /// <param name="go"> The GameObject which will be zoom-fit. This object may have
        ///                   children objects as well </param>
        /// <param name="ViewFromRandomDirecion"> if random viewing direction is chozen. </param>
        internal static void ZoomFit(Camera c, GameObject go, bool ViewFromRandomDirecion = false)
        {
            Bounds b = GetBound(go);
            Vector3 max = b.size;
            float radius = Mathf.Max(max.x, Mathf.Max(max.y, max.z));
            float dist = radius / Mathf.Sin(c.fieldOfView * Mathf.Deg2Rad / 2f);
            Debug.Log("Radius = " + radius + " dist = " + dist);

            Vector3 view_direction = ViewFromRandomDirecion ? UnityEngine.Random.onUnitSphere : c.transform.InverseTransformDirection(Vector3.forward);

            Vector3 pos = view_direction * dist + b.center;
            c.transform.position = pos;
            c.transform.LookAt(b.center);
        }
    }
}
