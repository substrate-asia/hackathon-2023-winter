package Model.blend;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.widget.ProgressBar;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import com.example.blend.R;


public class ComputationInProgressActivity extends AppCompatActivity {

    private ProgressBar progressBar;
    private TextView progressInfoTextView;
    private TextView computationTextView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.progress); // Replace with the actual layout file name

        // Initialize views
        progressBar = findViewById(R.id.pBar);
        progressInfoTextView = findViewById(R.id.Pinfo);
        computationTextView = findViewById(R.id.computation);

        // Simulate a long-running task (e.g., computation) with a progress update
        simulateLongRunningTask();
    }

    private void simulateLongRunningTask() {

        Handler handler = new Handler(Looper.getMainLooper());
        handler.postDelayed(new Runnable() {
            int progress = 0;

            @SuppressLint("StringFormatInvalid")
            @Override
            public void run() {
                // Update progress
                progressBar.setProgress(progress);
                progressInfoTextView.setText(getString(R.string.progress_info, progress));

                // Update computation status
                computationTextView.setText(getString(R.string.computation, progress));

                // Simulate completion after reaching 100%
                if (progress < 100) {
                    progress += 10; // Update based on your task progress
                    handler.postDelayed(this, 1000); // Update every second
                } else {
                    Intent intent = new Intent(ComputationInProgressActivity.this, ProfileActivity.class);
                    startActivity(intent);
                    finish();
                }
            }
        }, 1000);
    }
}
