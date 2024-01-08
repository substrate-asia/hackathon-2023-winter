package Model.blend;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;


import com.example.blend.R;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Locale;

public class FaceMeshAdapter extends BaseAdapter {

    private final Context context;
    private List<FaceMeshData> facemeshDataList;
    private FaceMeshClickListener clickListener;
    private FaceMeshData selectedFaceMeshData;

    public FaceMeshAdapter(Context context, List<FaceMeshData> facemeshDataList) {
        this.context = context;
        this.facemeshDataList = facemeshDataList;
    }

    public void setSelectedFaceMeshData(FaceMeshData selectedFaceMeshData) {
        this.selectedFaceMeshData = selectedFaceMeshData;
    }

    @Override
    public int getCount() {
        return facemeshDataList.size();
    }

    @Override
    public Object getItem(int position) {
        return facemeshDataList.get(position);
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    public interface FaceMeshClickListener {
        void onItemClick(FaceMeshData faceMeshData);
    }

    // Add this method
    public void setClickListener(FaceMeshClickListener listener) {
        this.clickListener = listener;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        if (convertView == null) {
            convertView = LayoutInflater.from(context).inflate(R.layout.list_item_box, parent, false);
        }

        TextView faceMeshTextView = convertView.findViewById(R.id.textView);
        TextView creationDateTextView = convertView.findViewById(R.id.creationDateTextView);

        FaceMeshData faceMeshData = facemeshDataList.get(position);
        faceMeshTextView.setText(faceMeshData.getJobName());


        // Set creation date
        SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy HH:mm", Locale.getDefault());
        Date creationDate = faceMeshData.getCreationDate();

        if (creationDate != null) {
            String formattedDate = sdf.format(creationDate);
            creationDateTextView.setText(formattedDate);
        } else {
            // Handle the case where creationDate is null
            // For example, set a default text or perform some other action
            creationDateTextView.setText("N/A");
        }
        faceMeshTextView.setOnClickListener(v -> {
            if (clickListener != null) {
                clickListener.onItemClick(faceMeshData);
            }
        });

        return convertView;
    }

}

