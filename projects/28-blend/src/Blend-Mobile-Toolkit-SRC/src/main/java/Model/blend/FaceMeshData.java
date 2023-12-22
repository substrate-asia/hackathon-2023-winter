package Model.blend;

import java.util.Date;

public class FaceMeshData {
    private final String jobName;
    private final String url;
    private Date creationDate;


    public FaceMeshData(String jobName, String url, Date creationDate) {
        this.jobName = jobName;
        this.url = url;
        this.creationDate = creationDate;
    }

    public String getJobName() {
        return jobName;
    }

    public String getUrl() {
        return url;
    }


    public Date getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(Date creationDate) {
        this.creationDate = creationDate;
    }
}
