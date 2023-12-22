package Model.blend;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.Button;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import com.example.blend.R;


public class ViewerActivity extends AppCompatActivity {

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_viewer);
        Button btnBackToProfile = findViewById(R.id.btnBack);

        btnBackToProfile.setOnClickListener(view -> {
            String jobName = getIntent().getStringExtra("jobName");
            Intent intent = new Intent(ViewerActivity.this, PreviewActivity.class);
            intent.putExtra("jobName", jobName);
            startActivity(intent);
            finish();
        });

        String jobName = getIntent().getStringExtra("jobName");
        Log.d("JOBNAME", "onCreate: " + jobName);
        WebView webView = findViewById(R.id.webView);
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        String faceMeshUrl = String.format("https://upload-selfie-image.s3.ap-southeast-1.amazonaws.com/outputs/%s.obj", jobName);
        // Replace "your_model_url" with the actual URL of your 3D model
//        String modelUrl = "https://example.com/your_model.obj";
        webView.loadUrl("https://3dviewer.net/index.html#model=" + faceMeshUrl);
    }

}